import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Trophy, Gamepad2, History, Activity, Zap, ChevronRight } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { getSetting } from '@/lib/actions/settings';
import { formatSeconds } from '@/lib/utils';
import Link from 'next/link';
import { getAllYears } from '@/lib/actions/history';
import { ExportPanel } from '@/components/modules/settings/export-panel';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const currentYearStr = await getSetting('currentYear') || '2026';
  const currentYear = parseInt(currentYearStr, 10);

  const [
    teamCount, 
    gameCount, 
    editRequestCount, 
    rawTeams,
    scoresLocked,
    allYears
  ] = await Promise.all([
    db.team.count({ where: { eventYear: currentYear } }),
    db.game.count({ where: { eventYear: currentYear } }),
    db.editRequest.count({ 
      where: { 
        status: 'PENDING',
        team: { eventYear: currentYear }
      } 
    }),
    db.team.findMany({
      where: { eventYear: currentYear },
      include: {
        gameScores: {
          where: { eventYear: currentYear },
          select: { totalPoints: true }
        }
      }
    }),
    getSetting('scoresLocked').then(v => v === 'true'),
    getAllYears()
  ]);
  
  const topTeams = rawTeams
    .map((team) => ({
      ...team,
      completedGames: team.gameScores.length,
      gameTotal: team.gameScores.reduce((sum, score) => sum + score.totalPoints, 0),
    }))
    .sort((a, b) => b.completedGames - a.completedGames || a.gameTotal - b.gameTotal || a.name.localeCompare(b.name))
    .slice(0, 5);

  const stats = [
    { label: "Total Teams", value: teamCount.toString(), icon: Trophy },
    { label: "Games Active", value: gameCount.toString(), icon: Gamepad2 },
    { label: "Pending Edits", value: editRequestCount.toString(), icon: History },
    { label: "Status", value: "Optimal", icon: Activity },
  ];

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of current event progress.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant={scoresLocked ? 'error' : 'success'} className="px-3 py-1">
             {scoresLocked ? 'Scores Locked' : 'Live'}
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <MetricCard 
            key={i}
            label={stat.label}
            value={stat.value}
            variant={i === 0 ? 'ivory' : 'default'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
        {/* Standings */}
        <Card className="lg:col-span-2 p-8 bg-white/[0.02] border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-white">Live Standings</h3>
            <Link href="/scores" className="text-xs font-medium text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
              Full Standings <ChevronRight size={14} />
            </Link>
          </div>

          {topTeams.length === 0 ? (
            <EmptyState 
              title="No data available"
              description="Teams will appear here once results are recorded."
              className="py-12 bg-black/20"
            />
          ) : (
            <div className="space-y-3">
              {topTeams.map((team, i) => (
                <div key={team.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-4">
                     <span className={cn(
                       "text-xs font-semibold w-8 h-8 rounded-full flex items-center justify-center border",
                       i === 0 ? "bg-accent text-black border-accent" : "text-muted-foreground border-white/5"
                     )}>
                       {i + 1}
                     </span>
                     <span className="font-medium text-white">{team.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{formatSeconds(team.gameTotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info */}
        <div className="space-y-8">
          <Card className="p-8 bg-white/[0.02] border-white/5">
            <h3 className="text-xl font-semibold text-white mb-6">Data Export</h3>
            <ExportPanel years={allYears} currentYear={currentYear} />
          </Card>
        </div>
      </div>
    </PageSection>
  );
}
