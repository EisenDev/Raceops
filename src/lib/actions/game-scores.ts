'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { isScoresLocked } from './settings';
import { parseDurationToSeconds } from '@/lib/utils';

const teamScoreSchema = z.object({
  gameId: z.string().uuid(),
  teamId: z.string().uuid(),
  totalPoints: z.number().int().min(0),
  note: z.string().optional().nullable(),
});

/**
 * Recalculates and updates a team's aggregate elapsed time from regular games only.
 */
export async function updateTeamAggregateScore(teamId: string, tx: Prisma.TransactionClient) {
  const team = await tx.team.findUnique({
    where: { id: teamId },
    include: {
      gameScores: {
        select: { totalPoints: true }
      }
    }
  });

  if (!team) return;

  const grandTotal = team.gameScores.reduce((sum, s) => sum + s.totalPoints, 0);

  await tx.team.update({
    where: { id: teamId },
    data: { totalScore: grandTotal }
  });
}

export async function saveTeamScore(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Unlock scores from Settings to make changes.' };
  }

  const gameId = formData.get('gameId') as string;
  const teamId = formData.get('teamId') as string;
  const totalPointsRaw = formData.get('totalPoints') as string;
  const totalPoints = parseDurationToSeconds(totalPointsRaw);
  const note = formData.get('note') as string;

  const result = teamScoreSchema.safeParse({ gameId, teamId, totalPoints, note });
  if (!result.success) return { error: totalPoints === null ? 'Enter a valid time like 5:30 or 1:05:30.' : result.error.issues[0].message };
  const validatedTotalPoints = result.data.totalPoints;

  try {
    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: 'Team not found.' };

    // Assigned Facilitator Rule
    if (user.role !== 'ADMIN' && team.assignedFacilitatorId !== user.id) {
      return { error: 'Unauthorized. You are not the assigned facilitator for this team.' };
    }

    const existingScore = await db.gameScore.findUnique({
      where: { gameId_teamId: { gameId, teamId } }
    });

    if (existingScore && user.role !== 'ADMIN') {
      return { error: 'Score already submitted. Please request an edit.' };
    }

    await db.$transaction(async (tx) => {
      const score = await tx.gameScore.upsert({
        where: { gameId_teamId: { gameId, teamId } },
        update: {
          totalPoints: validatedTotalPoints,
          scoringMode: 'TEAM_TOTAL',
          submittedById: user.id,
        },
        create: {
          gameId,
          teamId,
          totalPoints: validatedTotalPoints,
          scoringMode: 'TEAM_TOTAL',
          submittedById: user.id,
        },
      });

      // Clear any existing member scores if switching modes
      await tx.memberScore.deleteMany({ where: { gameScoreId: score.id } });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: existingScore ? 'UPDATE_SCORE' : 'CREATE_SCORE',
          module: 'GAME_SCORE',
          referenceId: score.id,
          details: { teamId, totalPoints: validatedTotalPoints, mode: 'TEAM_TOTAL' },
        },
      });

      await updateTeamAggregateScore(teamId, tx);
    });

    revalidatePath(`/games/${gameId}`);
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Save team score error:', error);
    return { error: 'Something went wrong.' };
  }
}

export async function saveMemberBreakdownScore(gameId: string, teamId: string, memberPoints: { memberId: string, points: number, note?: string }[]) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Unlock scores from Settings to make changes.' };
  }

  const totalPoints = memberPoints.reduce((sum, m) => sum + m.points, 0);

  try {
    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: 'Team not found.' };

    // Assigned Facilitator Rule
    if (user.role !== 'ADMIN' && team.assignedFacilitatorId !== user.id) {
      return { error: 'Unauthorized. You are not the assigned facilitator for this team.' };
    }

    const existingScore = await db.gameScore.findUnique({
      where: { gameId_teamId: { gameId, teamId } }
    });

    if (existingScore && user.role !== 'ADMIN') {
      return { error: 'Score already submitted. Please request an edit.' };
    }

    await db.$transaction(async (tx) => {
      const score = await tx.gameScore.upsert({
        where: { gameId_teamId: { gameId, teamId } },
        update: {
          totalPoints,
          scoringMode: 'MEMBER_BREAKDOWN',
          submittedById: user.id,
        },
        create: {
          gameId,
          teamId,
          totalPoints,
          scoringMode: 'MEMBER_BREAKDOWN',
          submittedById: user.id,
        },
      });

      // Reset member scores
      await tx.memberScore.deleteMany({ where: { gameScoreId: score.id } });
      
      if (memberPoints.length > 0) {
        await tx.memberScore.createMany({
          data: memberPoints.map(m => ({
            gameScoreId: score.id,
            teamMemberId: m.memberId,
            points: m.points,
            note: m.note,
          })),
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: existingScore ? 'UPDATE_SCORE' : 'CREATE_SCORE',
          module: 'GAME_SCORE',
          referenceId: score.id,
          details: { teamId, totalPoints, mode: 'MEMBER_BREAKDOWN', breakdown: memberPoints },
        },
      });

      await updateTeamAggregateScore(teamId, tx);
    });

    revalidatePath(`/games/${gameId}`);
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Save member breakdown error:', error);
    return { error: 'Something went wrong.' };
  }
}
