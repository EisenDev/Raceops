'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const generateCardsSchema = z.object({
  type: z.string().min(1),
  amount: z.number().int().min(1).max(100),
  customPoints: z.number().int().optional(),
});

const scanCardSchema = z.object({
  teamId: z.string().uuid(),
  code: z.string().min(1),
});

// Helper for random codes
function generateRandomCode(prefix: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ2346789'; // Removed O, 0, I, 1, S, 5
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}

const cardThemes: Record<string, { label: string; clue: string; points: number; prefix: string }[]> = {
  FRONTEND: [
    { label: 'Tailwind UI', clue: 'A clean layout starts with spacing, not decoration.', points: 10, prefix: 'UI' },
    { label: 'Vue Component', clue: 'Reactive by nature, reusable by design.', points: 10, prefix: 'VUE' },
    { label: 'Blade Layout', clue: 'The skeleton of the PHP world.', points: 10, prefix: 'BLD' },
    { label: 'Pure CSS Fix', clue: 'No frameworks needed for this aesthetic.', points: 10, prefix: 'CSS' },
  ],
  BACKEND: [
    { label: 'Laravel Route', clue: 'The entry point to your server logic.', points: 10, prefix: 'PHP' },
    { label: 'API Endpoint', clue: 'JSON in, JSON out. The language of the web.', points: 10, prefix: 'API' },
    { label: 'Auth Middleware', clue: 'Guard the gates of your application.', points: 10, prefix: 'ATH' },
    { label: 'Queue Worker', clue: 'Processing in the background while you sleep.', points: 10, prefix: 'QUE' },
  ],
  DATABASE: [
    { label: 'PostgreSQL Backup', clue: 'Data integrity is the foundation of trust.', points: 10, prefix: 'DB' },
    { label: 'Migration File', clue: 'The evolving history of your data structure.', points: 10, prefix: 'MIG' },
    { label: 'Clean Seed Data', clue: 'Start fresh with a reliable baseline.', points: 10, prefix: 'SED' },
  ],
  DEVOPS: [
    { label: 'GitHub Actions', clue: 'Automate the boring stuff.', points: 10, prefix: 'GH' },
    { label: 'Deployment Key', clue: 'The secret handshake between servers.', points: 10, prefix: 'KEY' },
    { label: 'Docker Image', clue: 'Ship your environment in a box.', points: 10, prefix: 'IMG' },
  ],
  CLOUD: [
    { label: 'DigitalOcean Droplet', clue: 'A small unit of compute in the great blue sea.', points: 10, prefix: 'DO' },
    { label: 'Azure VM', clue: 'Scale your enterprise to the clouds.', points: 10, prefix: 'MS' },
  ],
  SECURITY: [
    { label: 'Firewall Rule', clue: 'Block the noise, allow the signal.', points: 10, prefix: 'FW' },
    { label: 'Secure Session', clue: 'Keep your cookies fresh and signed.', points: 10, prefix: 'SES' },
    { label: 'Password Hash', clue: 'Never store plain text secrets.', points: 10, prefix: 'SH2' },
  ],
  BONUS: [
    { label: 'UI Polish', clue: 'Those extra 5% make all the difference.', points: 15, prefix: 'BON' },
    { label: 'Bug Fix', clue: 'One less issue in the tracker.', points: 15, prefix: 'FIX' },
  ],
  RARE: [
    { label: 'Zero Downtime', clue: 'Consistency is the ultimate performance.', points: 20, prefix: 'RAR' },
  ],
  BUGGED: [
    { label: 'Broken Build', clue: 'This build failed before deployment.', points: -5, prefix: 'BUG' },
    { label: 'Wrong Branch', clue: 'You are committing to the past, not the future.', points: -5, prefix: 'BUG' },
    { label: 'Expired SSL', clue: 'Your connections are no longer private.', points: -5, prefix: 'BUG' },
  ],
};

export async function generateTechOpsCards(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  const type = formData.get('type') as string;
  const amount = parseInt(formData.get('amount') as string);
  const customPoints = formData.get('points') ? parseInt(formData.get('points') as string) : undefined;

  const result = generateCardsSchema.safeParse({ type, amount, customPoints });
  if (!result.success) return { error: result.error.issues[0].message };

  const themes = cardThemes[type] || cardThemes.FRONTEND;

  try {
    const cards = [];
    for (let i = 0; i < amount; i++) {
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const code = generateRandomCode(theme.prefix);
      
      cards.push({
        code,
        qrPayload: `RACEOPS:${code}`,
        type,
        label: theme.label,
        clue: theme.clue,
        points: customPoints !== undefined ? customPoints : theme.points,
        generatedById: user.id,
      });
    }

    await db.techOpsCard.createMany({
      data: cards,
      skipDuplicates: true, // Safety for code collisions
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'TECHOPS_CARDS_GENERATED',
        module: 'TECHOPS',
        details: { type, amount },
      },
    });

    revalidatePath('/techops');
    return { success: true };
  } catch (error) {
    console.error('Generate cards error:', error);
    return { error: 'Failed to generate cards.' };
  }
}

export async function scanTechOpsCard(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  const teamId = formData.get('teamId') as string;
  let code = formData.get('code') as string;

  // Normalize code: remove prefix if scanned from QR
  if (code.startsWith('RACEOPS:')) {
    code = code.replace('RACEOPS:', '');
  }
  code = code.trim().toUpperCase();

  const result = scanCardSchema.safeParse({ teamId, code });
  if (!result.success) return { error: result.error.issues[0].message };

  try {
    const card = await db.techOpsCard.findUnique({
      where: { code },
    });

    if (!card) return { error: 'Card code not found.' };
    if (card.status === 'VOID') return { error: 'This card is void.' };
    if (card.status === 'USED') return { error: 'This card was already used.' };

    const team = await db.team.findUnique({
      where: { id: teamId },
    });
    if (!team) return { error: 'Team not found.' };

    const TECH_OPS_CAP = 200;
    
    // Logic for points
    let pointsToApply = card.points;
    let scanResult = 'SUCCESS';

    if (pointsToApply > 0) {
      if (team.techOpsScore >= TECH_OPS_CAP) {
        return { error: 'TechOps score cap reached (200 pts).' };
      }
      // Partial points if near cap
      if (team.techOpsScore + pointsToApply > TECH_OPS_CAP) {
        pointsToApply = TECH_OPS_CAP - team.techOpsScore;
        scanResult = 'CAP_REACHED';
      }
    } else if (pointsToApply < 0) {
      // Bug card: don't go below 0
      if (team.techOpsScore + pointsToApply < 0) {
        pointsToApply = -team.techOpsScore;
      }
    }

    await db.$transaction(async (tx) => {
      // Update Card
      await tx.techOpsCard.update({
        where: { id: card.id },
        data: {
          status: 'USED',
          usedByTeamId: teamId,
          usedAt: new Date(),
        },
      });

      // Create Scan Record
      await tx.techOpsScan.create({
        data: {
          cardId: card.id,
          teamId,
          scannedById: user.id,
          pointsApplied: pointsToApply,
          result: scanResult,
        },
      });

      // Update Team Score
      await tx.team.update({
        where: { id: teamId },
        data: {
          techOpsScore: { increment: pointsToApply },
          totalScore: { increment: pointsToApply },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'TECHOPS_CARD_SCANNED',
          module: 'TECHOPS',
          referenceId: card.id,
          details: { teamId, code: card.code, pointsApplied: pointsToApply, result: scanResult },
        },
      });
    });

    revalidatePath('/techops');
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Scan card error:', error);
    return { error: 'Something went wrong.' };
  }
}

export async function voidTechOpsCard(cardId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    const card = await db.techOpsCard.findUnique({ where: { id: cardId } });
    if (!card || card.status !== 'ACTIVE') return { error: 'Card not found or cannot be voided.' };

    await db.techOpsCard.update({
      where: { id: cardId },
      data: { status: 'VOID' },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'TECHOPS_CARD_VOIDED',
        module: 'TECHOPS',
        referenceId: cardId,
      },
    });

    revalidatePath('/techops');
    return { success: true };
  } catch (error) {
    console.error('Void card error:', error);
    return { error: 'Failed to void card.' };
  }
}
