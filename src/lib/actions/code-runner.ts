'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { LanguageTrack } from '@prisma/client';

const runCodeSchema = z.object({
  teamId: z.string().uuid({ message: 'Please select a team.' }),
  languageTrack: z.nativeEnum(LanguageTrack),
  submittedCode: z.string().min(1, { message: 'Please enter submitted code.' }),
});

/**
 * Normalizes code by trimming, unifying line endings, and collapsing repeated blank lines.
 */
function normalizeCode(code: string) {
  return code
    .trim()
    .replace(/\r\n/g, '\n') // Unify line endings
    .replace(/\n\s*\n/g, '\n') // Collapse repeated blank lines
    .replace(/[ \t]+\n/g, '\n'); // Remove trailing whitespace on lines
}

export async function runCodeRunner(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized.' };

  const rawData = {
    teamId: formData.get('teamId'),
    languageTrack: formData.get('languageTrack'),
    submittedCode: formData.get('submittedCode'),
  };

  const result = runCodeSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { teamId, languageTrack, submittedCode } = result.data;

  try {
    // 1. Verify user exists in database (session might be stale/old ID)
    const dbUser = await db.user.findUnique({
      where: { id: user.id }
    });
    
    if (!dbUser) {
      return { error: 'Session invalid. Please log out and log in again.' };
    }

    // 2. Check if team exists
    const team = await db.team.findUnique({
      where: { id: teamId },
    });
    if (!team) return { error: 'Team not found.' };

    // 2. Fetch all active challenges for this language track
    const challenges = await db.codeChallenge.findMany({
      where: { 
        languageTrack,
        status: 'ACTIVE'
      }
    });

    if (challenges.length === 0) {
      return { error: `No challenges registered for ${languageTrack}.` };
    }

    // 3. Validation Loop
    let matchedChallenge = null;
    const normalizedSubmitted = normalizeCode(submittedCode);

    for (const challenge of challenges) {
      const normalizedExpected = normalizeCode(challenge.correctCode);
      
      if (normalizedSubmitted === normalizedExpected) {
        matchedChallenge = challenge;
        break;
      }
    }

    const isAccepted = matchedChallenge !== null;
    const statusCode = isAccepted ? 200 : 500;
    const resultText = isAccepted ? 'Accepted' : 'Rejected';
    const hint = isAccepted ? '' : 'Check structure and logic.';

    // Special check for duplicate acceptance
    if (isAccepted && matchedChallenge) {
      const existingAccepted = await db.codeRunnerAttempt.findFirst({
        where: {
          challengeId: matchedChallenge.id,
          teamId: team.id,
          accepted: true,
        },
      });

      if (existingAccepted) {
        return { 
          status: 409, 
          result: 'Rejected', 
          hint: 'This challenge was already accepted for this team.' 
        };
      }
    }

    // 4. Log Attempt
    if (dbUser && dbUser.id) {
      try {
        await db.codeRunnerAttempt.create({
          data: {
            challengeId: matchedChallenge?.id || null,
            teamId: team.id,
            languageTrack,
            submittedCode,
            statusCode,
            result: resultText,
            accepted: isAccepted,
            genericHint: isAccepted ? null : 'Check structure and logic.',
            submittedById: dbUser.id,
          },
        });
      } catch (logError) {
        console.error('Failed to log attempt:', logError);
        // We continue anyway so the user gets their response
      }
    }

    revalidatePath('/code-runner');

    if (isAccepted) {
      return {
        status: 200,
        result: 'Accepted',
        message: 'Output matched.',
        output: matchedChallenge?.expectedOutput,
      };
    } else {
      return {
        status: 500,
        result: 'Rejected',
        hint: 'Check structure and logic.',
      };
    }

  } catch (error: unknown) {
    console.error('Code runner error:', error);
    const message = error instanceof Error ? error.message : 'Check database connection.';
    return { error: `System Error: ${message}` };
  }
}

export async function getRecentAttempts() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.codeRunnerAttempt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      team: true,
      challenge: true,
      submittedBy: true,
    },
  });
}

export async function getCodeChallenges(language?: LanguageTrack) {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.codeChallenge.findMany({
    where: language ? { languageTrack: language } : undefined,
    orderBy: [
      { languageTrack: 'asc' },
      { title: 'asc' }
    ],
    select: {
      id: true,
      languageTrack: true,
      difficulty: true,
      title: true,
      status: true,
      prompt: true,
      participantCode: true,
    }
  });
}

export async function getCodeChallengeDetails(challengeId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return null;

  return db.codeChallenge.findUnique({
    where: { id: challengeId }
  });
}
