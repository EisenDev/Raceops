'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { isScoresLocked } from './settings';
import { parseDurationToSeconds } from '@/lib/utils';

const gameSchema = z.object({
  name: z.string().min(1, 'Game name is required'),
  maxPoints: z.number().int().optional(),
  mechanics: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED']).optional(),
});

export async function createGame(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized.' };
  }

  const name = formData.get('name') as string;
  const mechanics = formData.get('mechanics') as string;

  const result = gameSchema.safeParse({ name, mechanics, maxPoints: 0 });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const game = await db.game.create({
      data: {
        name: result.data.name,
        maxPoints: 0,
        mechanics: result.data.mechanics,
        status: 'DRAFT',
      },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'CREATE_GAME',
        module: 'GAME',
        referenceId: game.id,
        details: { name: game.name },
      },
    });

    revalidatePath('/games');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Create game error:', error);
    return { error: 'Failed to create game.' };
  }
}

export async function updateGame(gameId: string, prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized.' };
  }

  const name = formData.get('name') as string;
  const mechanics = formData.get('mechanics') as string;
  const status = formData.get('status') as 'DRAFT' | 'ACTIVE' | 'COMPLETED' | null;

  const result = gameSchema.safeParse({ name, mechanics, status });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const game = await db.game.update({
      where: { id: gameId },
      data: result.data,
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'UPDATE_GAME',
        module: 'GAME',
        referenceId: game.id,
        details: { name: game.name },
      },
    });

    revalidatePath('/games');
    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error('Update game error:', error);
    return { error: 'Failed to update game.' };
  }
}

export async function deleteGame(gameId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return { error: 'Unauthorized.' };
  }

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Games cannot be deleted.' };
  }

  try {
    const hasScores = await db.gameScore.findFirst({ where: { gameId } });
    if (hasScores) {
      return { error: 'Cannot delete game with existing scores.' };
    }

    await db.$transaction([
      db.game.delete({ where: { id: gameId } }),
      db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'DELETE_GAME',
          module: 'GAME',
          referenceId: gameId,
        },
      }),
    ]);

    revalidatePath('/games');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete game error:', error);
    return { error: 'Failed to delete game.' };
  }
}
