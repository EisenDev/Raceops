'use server';

import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

import { cache } from 'react';

export const getSetting = cache(async (key: string) => {
  const setting = await db.gameSetting.findUnique({
    where: { key }
  });
  return setting?.value || null;
});

export async function isScoresLocked() {
  const value = await getSetting('scoresLocked');
  return value === 'true';
}

export async function lockScores() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    await db.$transaction([
      db.gameSetting.upsert({
        where: { key: 'scoresLocked' },
        update: { value: 'true' },
        create: { key: 'scoresLocked', value: 'true' }
      }),
      db.gameSetting.upsert({
        where: { key: 'lockedAt' },
        update: { value: new Date().toISOString() },
        create: { key: 'lockedAt', value: new Date().toISOString() }
      }),
      db.gameSetting.upsert({
        where: { key: 'lockedBy' },
        update: { value: user.displayName },
        create: { key: 'lockedBy', value: user.displayName }
      }),
      db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'SCORES_LOCKED',
          module: 'SETTINGS',
          details: { lockedAt: new Date().toISOString() }
        }
      })
    ]);

    revalidatePath('/settings');
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Lock scores error:', error);
    return { error: 'Failed to lock scores.' };
  }
}

export async function unlockScores() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    await db.$transaction([
      db.gameSetting.update({
        where: { key: 'scoresLocked' },
        data: { value: 'false' }
      }),
      db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'SCORES_UNLOCKED',
          module: 'SETTINGS'
        }
      })
    ]);

    revalidatePath('/settings');
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Unlock scores error:', error);
    return { error: 'Failed to unlock scores.' };
  }
}

export async function updateEventName(name: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    await db.gameSetting.upsert({
      where: { key: 'eventName' },
      update: { value: name },
      create: { key: 'eventName', value: name }
    });

    revalidatePath('/');
    revalidatePath('/login');
    revalidatePath('/scoreboard');
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Update event name error:', error);
    return { error: 'Failed to update event name.' };
  }
}
