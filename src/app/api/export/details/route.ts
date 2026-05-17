import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const gameScores = await db.gameScore.findMany({
      include: {
        game: true,
        team: {
          include: {
            gameScores: {
              select: { totalPoints: true }
            }
          }
        },
      },
      orderBy: [
        { team: { name: 'asc' } },
        { game: { name: 'asc' } }
      ]
    });

    const headers = ['Team', 'Game Name', 'Elapsed Time (seconds)', 'Time Limit (seconds)', 'Scoring Mode', 'Team Total Time (seconds)'];
    const rows = gameScores.map((gs) => {
      const gameTotal = gs.team.gameScores.reduce((sum, score) => sum + score.totalPoints, 0);
      return [
        gs.team.name,
        gs.game.name,
        gs.totalPoints,
        gs.game.maxPoints,
        gs.scoringMode,
        gameTotal
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Audit Log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        action: 'SCORE_EXPORT_GENERATED',
        module: 'EXPORT',
        details: { type: 'DETAILED' }
      }
    });

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="raceops-scores-detailed-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
