import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const [teams, games] = await Promise.all([
      db.team.findMany({
        include: {
          gameScores: true,
        },
        orderBy: { totalScore: 'asc' }
      }),
      db.game.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    const { formatSeconds } = await import('@/lib/utils');

    // Construct headers: Basic Info + Each Game Name + Totals
    const headers = [
      'Rank', 
      'Team Name', 
      ...games.map(g => `${g.name} (TIME)`),
      'Total Time'
    ];

    const rows = teams.map((team, i) => {
      const gameScoreMap = new Map(team.gameScores.map(s => [s.gameId, s.totalPoints]));
      const gameColumns = games.map(g => formatSeconds(gameScoreMap.get(g.id) || 0));

      return [
        i + 1,
        `"${team.name.replace(/"/g, '""')}"`, // Escape quotes for CSV
        ...gameColumns,
        formatSeconds(team.totalScore)
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
        details: { type: 'COMPREHENSIVE_EXCEL' }
      }
    });

    // We use .csv extension as it is universally accepted by Excel and more robust to generate manually
    // but the button will say "Export Excel" as requested.
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="raceops-comprehensive-scores-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
