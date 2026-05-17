'use server';

import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { BountyStatus } from '@prisma/client';
import { isScoresLocked } from './settings';

// Helper for random codes
function generateRandomCode(prefix: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ2346789'; // Removed O, 0, I, 1, S, 5
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BNT-${prefix}-${result}`;
}

export async function generateTeamBounties() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. No new bounties can be generated.' };
  }

  try {
    const teams = await db.team.findMany({
      where: {
        bountyTarget: null,
      },
    });

    if (teams.length === 0) {
      return { error: 'All teams already have bounties or no teams found.' };
    }

    const bounties = teams.map((team) => {
      const prefix = team.name.slice(0, 3).toUpperCase().replace(/\s+/g, '');
      return {
        teamId: team.id,
        code: generateRandomCode(prefix),
        points: 100,
        status: 'ACTIVE' as BountyStatus,
      };
    });

    await db.bounty.createMany({
      data: bounties,
      skipDuplicates: true,
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'BOUNTIES_GENERATED',
        module: 'BOUNTY',
        details: { count: bounties.length },
      },
    });

    revalidatePath('/bounty');
    return { success: true };
  } catch (error) {
    console.error('Generate bounties error:', error);
    return { error: 'Failed to generate bounties.' };
  }
}

export async function claimBounty(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  if (await isScoresLocked()) {
    return { error: 'Scores are locked. Bounty claiming is disabled.' };
  }

  const claimingTeamId = formData.get('claimingTeamId') as string;
  let code = formData.get('code') as string;

  if (!claimingTeamId) return { error: 'Please select a team.' };
  if (!code) return { error: 'Please enter a bounty code.' };

  // Normalize code
  if (code.startsWith('RACEOPS:BOUNTY:')) {
    code = code.replace('RACEOPS:BOUNTY:', '');
  }
  code = code.trim().toUpperCase();

  try {
    const bounty = await db.bounty.findUnique({
      where: { code },
      include: { team: true },
    });

    if (!bounty) return { error: 'Bounty code not found.' };
    if (bounty.status === 'CLAIMED') return { error: 'This bounty was already claimed.' };
    if (bounty.status === 'VOID') return { error: 'This bounty is void.' };
    if (bounty.status === 'NULLIFIED') return { error: 'This bounty is no longer active.' };

    const claimingTeam = await db.team.findUnique({
      where: { id: claimingTeamId },
    });

    if (!claimingTeam) return { error: 'Claiming team not found.' };

    const BOUNTY_CAP = 100;
    if (claimingTeam.bountyScore >= BOUNTY_CAP) {
      return { error: 'Team bounty cap reached (100 pts).' };
    }

    const pointsToApply = bounty.points;

    await db.$transaction(async (tx) => {
      // Update Bounty
      await tx.bounty.update({
        where: { id: bounty.id },
        data: {
          status: 'CLAIMED',
          claimedByTeamId: claimingTeamId,
          recordedById: user.id,
          recordedAt: new Date(),
        },
      });

      // Update Team Score
      await tx.team.update({
        where: { id: claimingTeamId },
        data: {
          bountyScore: { increment: pointsToApply },
          totalScore: { increment: pointsToApply },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'BOUNTY_CLAIMED',
          module: 'BOUNTY',
          referenceId: bounty.id,
          details: { 
            code: bounty.code, 
            targetTeam: bounty.team.name, 
            claimingTeam: claimingTeam.name, 
            points: pointsToApply 
          },
        },
      });
    });

    revalidatePath('/bounty');
    revalidatePath('/scores');
    revalidatePath('/scoreboard');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Claim bounty error:', error);
    return { error: 'Something went wrong.' };
  }
}

export async function voidBounty(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized.' };

  try {
    await db.bounty.update({
      where: { id },
      data: { status: 'VOID' },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'BOUNTY_VOIDED',
        module: 'BOUNTY',
        referenceId: id,
      },
    });

    revalidatePath('/bounty');
    return { success: true };
  } catch (error) {
    console.error('Void bounty error:', error);
    return { error: 'Failed to void bounty.' };
  }
}
