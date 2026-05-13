'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { EditRequestModule, Prisma } from '@prisma/client';

const editRequestSchema = z.object({
  requestModule: z.nativeEnum(EditRequestModule),
  referenceId: z.string().uuid(),
  teamId: z.string().uuid(),
  currentValue: z.any(),
  requestedValue: z.any(),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

export async function createEditRequest(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  const requestModule = formData.get('module') as EditRequestModule;
  const referenceId = formData.get('referenceId') as string;
  const teamId = formData.get('teamId') as string;
  const reason = formData.get('reason') as string;
  
  const currentValueRaw = formData.get('currentValue') as string;
  const requestedValueRaw = formData.get('requestedValue') as string;

  let currentValue, requestedValue;
  try {
    currentValue = JSON.parse(currentValueRaw);
    requestedValue = JSON.parse(requestedValueRaw);
  } catch {
    return { error: 'Invalid data format.' };
  }

  const result = editRequestSchema.safeParse({
    requestModule,
    referenceId,
    teamId,
    currentValue,
    requestedValue,
    reason,
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const editRequest = await db.editRequest.create({
      data: {
        module: result.data.requestModule,
        referenceId: result.data.referenceId,
        teamId: result.data.teamId,
        requestedById: user.id,
        currentValue: result.data.currentValue,
        requestedValue: result.data.requestedValue,
        reason: result.data.reason,
        status: 'PENDING',
      },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'EDIT_REQUEST_CREATED',
        module: 'EDIT_REQUEST',
        referenceId: editRequest.id,
        details: { module: requestModule, teamId, referenceId },
      },
    });

    revalidatePath('/edit-requests');
    return { success: true };
  } catch (error) {
    console.error('Create edit request error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function approveEditRequest(id: string, adminRemarks?: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    const request = await db.editRequest.findUnique({
      where: { id },
      include: { team: true }
    });

    if (!request || request.status !== 'PENDING') {
      return { error: 'Request not found or already processed.' };
    }

    const requestedValue = request.requestedValue as { totalPoints: number; scoringMode: 'TEAM_TOTAL' | 'MEMBER_BREAKDOWN'; memberScores: { memberId: string; points: number }[] };

    await db.$transaction(async (tx) => {
      // 1. Update GameScore
      if (request.module === 'GAME_SCORE') {
        const gameScore = await tx.gameScore.update({
          where: { id: request.referenceId },
          data: {
            totalPoints: requestedValue.totalPoints,
            scoringMode: requestedValue.scoringMode,
            submittedById: request.requestedById,
          },
        });

        // 2. Update MemberScores if applicable
        await tx.memberScore.deleteMany({ where: { gameScoreId: gameScore.id } });
        if (requestedValue.scoringMode === 'MEMBER_BREAKDOWN' && requestedValue.memberScores) {
          await tx.memberScore.createMany({
            data: requestedValue.memberScores.map((ms) => ({
              gameScoreId: gameScore.id,
              teamMemberId: ms.memberId,
              points: ms.points,
            })),
          });
        }

        // 3. Update Team Total
        await updateTeamAggregateScore(request.teamId, tx);
      }

      // 4. Update Request Status
      await tx.editRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          adminRemarks,
          reviewedById: user.id,
          reviewedAt: new Date(),
        },
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'EDIT_REQUEST_APPROVED',
          module: 'EDIT_REQUEST',
          referenceId: id,
          details: { referenceId: request.referenceId, teamId: request.teamId },
        },
      });
    });

    revalidatePath('/edit-requests');
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Approve edit request error:', error);
    return { error: 'Failed to approve request.' };
  }
}

export async function declineEditRequest(id: string, adminRemarks?: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    await db.editRequest.update({
      where: { id },
      data: {
        status: 'DECLINED',
        adminRemarks,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'EDIT_REQUEST_DECLINED',
        module: 'EDIT_REQUEST',
        referenceId: id,
        details: { adminRemarks },
      },
    });

    revalidatePath('/edit-requests');
    return { success: true };
  } catch (error) {
    console.error('Decline edit request error:', error);
    return { error: 'Failed to decline request.' };
  }
}

async function updateTeamAggregateScore(teamId: string, tx: Prisma.TransactionClient) {
  const scores = await tx.gameScore.findMany({
    where: { teamId },
    select: { totalPoints: true }
  });

  const total = scores.reduce((sum: number, s: { totalPoints: number }) => sum + s.totalPoints, 0);

  await tx.team.update({
    where: { id: teamId },
    data: { totalScore: total }
  });
}
