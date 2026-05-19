import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Trophy, Gamepad2, Users, Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import db from '@/lib/db';
import { formatSeconds } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

interface HistoryPageProps {
  params: Promise<{ year: string }>;
}

export default async function HistoryYearPage({ params }: HistoryPageProps) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year)) notFound();

  const [teams, games] = await Promise.all([
    db.team.findMany({
      where: { eventYear: year },
      include: {
        gameScores: {
          where: { eventYear: year }
        }
      }
    }),
    db.game.findMany({
      where: { eventYear: year },
      include: {
        _count: {
          select: { gameScores: true }
        }
      }
    }),
  ]);

  if (teams.length === 0 && games.length === 0) {
    notFound();
  }

  const rankedTeams = teams
    .map((team) => ({
      ...team,
      completedGames: team.gameScores.length,
      gameTotal: team.gameScores.reduce((sum, score) => sum + score.totalPoints, 0),
    }))
    .sort((a, b) => b.completedGames - a.completedGames || a.gameTotal - b.gameTotal || a.name.localeCompare(b.name));

  return (
    <PageSection className="py-4 pb-24">
      <div className="mb-12 space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-white">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent opacity-80 mb-2">
               <Calendar size={14} />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Historical Archive</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">Year {year}</h1>
            <p className="text-sm text-muted-foreground font-medium">Archived results and mission records for the {year} event.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Standings */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center gap-3 px-2">
              <Trophy size={18} className="text-accent" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Final Standings</h3>
           </div>
           
           <div className="space-y-3">
              {rankedTeams.map((team, i) => (
                <div key={team.id} className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-6">
                     <span className={cn(
                       "text-xs font-black w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                       i === 0 ? "bg-accent text-black border-accent" : "text-muted-foreground border-white/10"
                     )}>
                       {i + 1}
                     </span>
                     <div>
                        <p className="font-bold text-lg text-white uppercase tracking-tight">{team.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{team.completedGames} Missions completed</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white tracking-tighter">{formatSeconds(team.gameTotal)}</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Final Aggregated Time</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Missions */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex items-center gap-3 px-2">
              <Gamepad2 size={18} className="text-muted-foreground" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Mission Catalog</h3>
           </div>
           
           <div className="space-y-4">
              {games.map((game) => (
                <Card key={game.id} className="p-6 bg-white/[0.01] border-white/5">
                   <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-white uppercase tracking-tight leading-tight">{game.name}</h4>
                      <Badge variant="muted" className="text-[8px]">{game._count.gameScores} Logs</Badge>
                   </div>
                   {game.mechanics && (
                     <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">{game.mechanics}</p>
                   )}
                   <div className="flex items-center gap-2 text-white/40">
                      <Users size={12} />
                      <span className="text-[10px] font-medium uppercase tracking-widest">Year {year} Protocol</span>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      </div>
    </PageSection>
  );
}
