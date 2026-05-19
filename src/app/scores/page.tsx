import { PageSection } from '@/components/ui/PageSection';
import { Trophy, RefreshCcw, Lock, Info, Activity, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { getSetting } from '@/lib/actions/settings';
import { RealtimeRefresh } from '@/components/ui/RealtimeRefresh';
import { formatSeconds } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ScoresPage() {
  const currentYearStr = await getSetting('currentYear') || '2026';
  const currentYear = parseInt(currentYearStr, 10);

  const [rawTeams, scoresLocked] = await Promise.all([
    db.team.findMany({
      where: { eventYear: currentYear },
      include: {
        gameScores: {
          where: { eventYear: currentYear }
        },
      }
    }),
    getSetting('scoresLocked').then(v => v === 'true')
  ]);
  
  const teams = rawTeams
    .map((team) => ({
      ...team,
      completedGames: team.gameScores.length,
      gameTotal: team.gameScores.reduce((sum, score) => sum + score.totalPoints, 0),
    }))
    .sort((a, b) => b.completedGames - a.completedGames || a.gameTotal - b.gameTotal || a.name.localeCompare(b.name));

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Standings</h1>
          <p className="text-sm text-muted-foreground font-medium">Real-time leaderboard based on mission performance.</p>
          {!scoresLocked && <RealtimeRefresh />}
        </div>
        <div className="flex items-center gap-3">
           <a href="/api/export/scores" download>
              <Button variant="secondary" size="sm" className="h-10">
                 <Download size={14} className="mr-2 opacity-60" />
                 Export
              </Button>
           </a>
           <Button variant="outline" size="sm" className="h-10 px-4 group">
             <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
           </Button>
        </div>
      </div>

      {scoresLocked && (
        <div className="mb-10 p-5 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Lock size={18} />
           </div>
           <div>
              <p className="text-sm font-semibold text-red-400">Final scores are locked</p>
              <p className="text-xs text-red-500/60 font-medium">Results are now official and immutable.</p>
           </div>
        </div>
      )}

      {teams.length === 0 ? (
        <EmptyState 
          title="No competition data"
          description="The leaderboard will update automatically as scores are recorded."
          icon={<Trophy size={40} className="text-muted-foreground/20" />}
        />
      ) : (
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left">
                  <th className="px-6 pb-2 text-xs font-semibold text-muted-foreground opacity-50">Rank</th>
                  <th className="px-6 pb-2 text-xs font-semibold text-muted-foreground opacity-50">Team</th>
                  <th className="px-6 pb-2 text-xs font-semibold text-muted-foreground opacity-50 text-center">Missions</th>
                  <th className="px-6 pb-2 text-xs font-semibold text-muted-foreground opacity-50 text-right">Total Time</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, i) => (
                  <tr key={team.id} className="group">
                    <td className="bg-white/[0.02] border-y border-l border-white/5 rounded-l-xl px-6 py-5 group-hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold",
                          i === 0 ? "bg-accent text-black" : "text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                      </div>
                    </td>
                    <td className="bg-white/[0.02] border-y border-white/5 px-6 py-5 group-hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-1 h-6 rounded-full" style={{ backgroundColor: team.color || '#C5A059' }} />
                         <span className="font-medium text-white">{team.name}</span>
                      </div>
                    </td>
                    <td className="bg-white/[0.02] border-y border-white/5 px-6 py-5 group-hover:bg-white/[0.04] transition-all text-center">
                       <span className="text-xs font-medium text-muted-foreground">{team.completedGames} completed</span>
                    </td>
                    <td className="bg-white/[0.02] border-y border-r border-white/5 rounded-r-xl px-6 py-5 group-hover:bg-white/[0.04] transition-all text-right">
                      <span className={cn(
                        "text-xl font-semibold tabular-nums tracking-tight",
                        i === 0 ? "text-accent" : "text-white/90"
                      )}>
                        {formatSeconds(team.gameTotal)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
             <Info size={18} className="text-accent shrink-0 mt-0.5" />
             <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Total time is the sum of all completed mission records. For a detailed breakdown per game, visit the <strong>Games</strong> page.
             </p>
          </div>
        </div>
      )}
    </PageSection>
  );
}
