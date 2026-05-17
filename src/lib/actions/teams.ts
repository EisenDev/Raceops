'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { isScoresLocked } from './settings';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  color: z.string().optional(),
  assignedFacilitatorId: z.string().uuid().optional().nullable(),
  members: z.array(z.string().min(1)).optional(),
});

export async function createTeam(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized. Only admins can create teams.' };
  }

  const rawMembers = formData.getAll('member');
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;
  const assignedFacilitatorId = formData.get('assignedFacilitatorId') as string || null;
  
  const members = (rawMembers as string[])
    .map(m => m.trim())
    .filter(m => m.length > 0);

  const result = teamSchema.safeParse({ name, color, assignedFacilitatorId, members });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const existingTeam = await db.team.findUnique({ where: { name: result.data.name } });
    if (existingTeam) {
      return { error: 'This team name already exists.' };
    }

    // Create team and members in a transaction
    await db.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: result.data.name,
          code: result.data.name.toUpperCase().replace(/\s+/g, '_'),
          color: result.data.color,
          assignedFacilitatorId: result.data.assignedFacilitatorId,
        },
      });

      if (members.length > 0) {
        await tx.teamMember.createMany({
          data: members.map(m => ({
            name: m,
            teamId: team.id,
          })),
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'CREATE_TEAM',
          module: 'TEAM',
          referenceId: team.id,
          details: { name: team.name, membersCount: members.length },
        },
      });
    });

    revalidatePath('/teams');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Create team error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function updateTeam(teamId: string, prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized. Only admins can update teams.' };
  }

  const name = formData.get('name') as string;
  const color = formData.get('color') as string;
  const assignedFacilitatorId = formData.get('assignedFacilitatorId') as string || null;

  if (!name) return { error: 'Team name is required.' };

  try {
    const team = await db.team.update({
      where: { id: teamId },
      data: { 
        name, 
        color,
        assignedFacilitatorId
      },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'UPDATE_TEAM',
        module: 'TEAM',
        referenceId: team.id,
        details: { name: team.name },
      },
    });

    revalidatePath('/teams');
    return { success: true };
  } catch (error) {
    console.error('Update team error:', error);
    return { error: 'Something went wrong.' };
  }
}

export async function deleteTeam(teamId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized.' };
  }

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Teams cannot be deleted.' };
  }

  try {
    // Check if team has scores
    const hasScores = await db.gameScore.findFirst({ where: { teamId } });
    if (hasScores) {
      return { error: 'Cannot delete team with existing scores.' };
    }

    await db.$transaction([
      db.teamMember.deleteMany({ where: { teamId } }),
      db.team.delete({ where: { id: teamId } }),
      db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'DELETE_TEAM',
          module: 'TEAM',
          referenceId: teamId,
        },
      }),
    ]);

    revalidatePath('/teams');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete team error:', error);
    return { error: 'Failed to delete team.' };
  }
}

export async function addTeamMember(teamId: string, name: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized.' };
  }

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Member management is disabled.' };
  }

  if (!name) return { error: 'Member name is required.' };

  try {
    const member = await db.teamMember.create({
      data: { name, teamId },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'ADD_MEMBER',
        module: 'TEAM',
        referenceId: member.id,
        details: { teamId, name: member.name },
      },
    });

    revalidatePath('/teams');
    return { success: true };
  } catch (error) {
    console.error('Add member error:', error);
    return { error: 'Failed to add member.' };
  }
}

export async function deleteTeamMember(memberId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized.' };
  }

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Member management is disabled.' };
  }

  try {
    const member = await db.teamMember.delete({
      where: { id: memberId },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'DELETE_MEMBER',
        module: 'TEAM',
        referenceId: memberId,
        details: { name: member.name, teamId: member.teamId },
      },
    });

    revalidatePath('/teams');
    return { success: true };
  } catch (error) {
    console.error('Delete member error:', error);
    return { error: 'Failed to remove member.' };
  }
}
