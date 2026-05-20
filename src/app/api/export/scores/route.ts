import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import * as XLSX from 'xlsx';
import { formatSeconds } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedYear = searchParams.get('year');

  try {
    const currentYearSetting = await db.gameSetting.findUnique({ where: { key: 'currentYear' } });
    const defaultYear = parseInt(currentYearSetting?.value || '2026', 10);
    const year = requestedYear ? parseInt(requestedYear, 10) : defaultYear;

    const [teams, games] = await Promise.all([
      db.team.findMany({
        where: { eventYear: year },
        include: {
          gameScores: {
            where: { eventYear: year }
          },
        },
        orderBy: { totalScore: 'asc' }
      }),
      db.game.findMany({
        where: { eventYear: year },
        orderBy: { name: 'asc' }
      })
    ]);

    // Construct Header Row
    const headers = [
      'Rank', 
      'Team Name', 
      ...games.map(g => `${g.name} (Time)`),
      'Total Aggregate Time'
    ];

    // Construct Data Rows
    const rows = teams.map((team, i) => {
      const gameScoreMap = new Map(team.gameScores.map(s => [s.gameId, s.totalPoints]));
      const gameColumns = games.map(g => formatSeconds(gameScoreMap.get(g.id) || 0));

      return [
        i + 1,
        team.name,
        ...gameColumns,
        formatSeconds(team.totalScore)
      ];
    });

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Set column widths
    const colWidths = headers.map(h => ({ wch: Math.max(h.length, 15) }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Event Standings');

    // Generate buffer as Uint8Array (type: 'array') for standard Response compatibility
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

    // Create Audit Log
    try {
      await db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'EXCEL_EXPORT_GENERATED',
          module: 'EXPORT',
          details: { type: 'STANDINGS_XLSX', year }
        }
      });
    } catch (auditError) {
      console.error('Audit log failed during export:', auditError);
    }

    return new Response(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Infosoft-RaceOps-Results-${year}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('CRITICAL EXPORT ERROR:', error);
    return new Response(
      error instanceof Error ? error.message : 'Unknown export error', 
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
