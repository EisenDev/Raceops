import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import * as XLSX from 'xlsx';
import { formatSeconds } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return new Response('Unauthorized', { status: 401 });
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

    const headers = ['Team', 'Game Name', 'Mission Time', 'Scoring Mode', 'Team Total Aggregate'];
    const rows = gameScores.map((gs) => {
      const gameTotal = gs.team.gameScores.reduce((sum, score) => sum + score.totalPoints, 0);
      return [
        gs.team.name,
        gs.game.name,
        formatSeconds(gs.totalPoints),
        gs.scoringMode,
        formatSeconds(gameTotal)
      ];
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Set column widths
    const colWidths = headers.map(h => ({ wch: Math.max(h.length, 20) }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Detailed Audit Log');

    // Generate buffer as Uint8Array
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

    // Create Audit Log
    try {
      await db.auditLog.create({
        data: {
          actorId: user.id,
          action: 'EXCEL_EXPORT_GENERATED',
          module: 'EXPORT',
          details: { type: 'DETAILED_AUDIT_XLSX' }
        }
      });
    } catch (auditError) {
      console.error('Audit log failed during export:', auditError);
    }

    return new Response(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Infosoft-RaceOps-Detailed-Audit-${new Date().getFullYear()}.xlsx"`,
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
