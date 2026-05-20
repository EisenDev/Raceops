'use server';

import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

import { getSetting } from './settings';

import { cache } from 'react';

export const getHistoryYears = cache(async () => {
  const currentYearStr = await getSetting('currentYear') || '2026';
  const currentYear = parseInt(currentYearStr, 10);

  const [teamYears, gameYears] = await Promise.all([
    db.team.findMany({
      select: { eventYear: true },
      distinct: ['eventYear'],
    }),
    db.game.findMany({
      select: { eventYear: true },
      distinct: ['eventYear'],
    }),
  ]);

  const allYears = Array.from(new Set([
    ...teamYears.map(y => y.eventYear),
    ...gameYears.map(y => y.eventYear),
  ])).sort((a, b) => b - a);

  // We only show years that are NOT the current active one
  return allYears.filter(year => year !== currentYear);
});

export async function archiveCurrentYear(targetYear: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  const currentYearStr = await getSetting('currentYear') || '2026';
  const currentYear = parseInt(currentYearStr, 10);

  try {
    await db.$transaction([
      // Update all teams that are currently in the active year
      db.team.updateMany({
        where: { eventYear: currentYear },
        data: { eventYear: targetYear }
      }),
      // Update all games
      db.game.updateMany({
        where: { eventYear: currentYear },
        data: { eventYear: targetYear }
      }),
      // Update all game scores
      db.gameScore.updateMany({
        where: { eventYear: currentYear },
        data: { eventYear: targetYear }
      }),
      // Automatically increment the system's current year for the next event
      db.gameSetting.upsert({
        where: { key: 'currentYear' },
        update: { value: (targetYear + 1).toString() },
        create: { key: 'currentYear', value: (targetYear + 1).toString() }
      }),
      // Log the action
      db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'ARCHIVE_YEAR',
          module: 'SETTINGS',
          details: { archivedYear: targetYear, nextYear: targetYear + 1 }
        }
      })
    ]);

    revalidatePath('/settings');
    revalidatePath('/dashboard');
    revalidatePath('/history');
    return { success: true };
  } catch (error) {
    console.error('Archive year error:', error);
    return { error: 'Failed to archive data.' };
  }
}
