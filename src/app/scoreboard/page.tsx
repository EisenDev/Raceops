import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Zap } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { getSetting } from '@/lib/actions/settings';
import { RealtimeRefresh } from '@/components/ui/RealtimeRefresh';
import { formatSeconds } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PublicScorePage() {
  const currentYearStr = await getSetting('currentYear') || '2026';
  const currentYear = parseInt(currentYearStr, 10);

  const [rawTeams, scoresLocked] = await Promise.all([
    db.team.findMany({
      where: { eventYear: currentYear },
      include: {
        gameScores: {
          where: { eventYear: currentYear },
          select: { totalPoints: true }
        }
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
    <main className="min-h-screen bg-background p-6 md:p-12 lg:p-24 selection:bg-accent/30 overflow-x-hidden">
      <RealtimeRefresh showIndicator={false} />
      
      <PageSection spacing="lg" className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
          <div className="space-y-4">
             <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-semibold tracking-tight text-white leading-none">
                  Standings
                </h1>
                <p className="text-xl md:text-2xl font-medium text-muted-foreground tracking-tight opacity-70">
                  Infosoft Amazing Race 2026
                </p>
             </div>
          </div>
          
          <div className="flex gap-10">
            <div className="space-y-1">
               <p className="text-xs font-medium text-muted-foreground opacity-50">Status</p>
               <p className={cn(
                 "text-2xl font-semibold tracking-tight",
                 scoresLocked ? "text-red-500" : "text-emerald-500"
               )}>
                 {scoresLocked ? 'Official' : 'Live'}
               </p>
            </div>
            <div className="space-y-1 text-right">
               <p className="text-xs font-medium text-muted-foreground opacity-50">Teams</p>
               <p className="text-2xl font-semibold text-white tracking-tight">
                 {teams.length}
               </p>
            </div>
          </div>
        </div>

        {teams.length === 0 ? (
          <EmptyState 
            title="Awaiting results"
            description="Standings will appear once teams begin recording mission scores."
            icon={<Zap size={40} className="text-accent/20" />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {teams.map((team, i) => (
              <Card 
                key={team.id} 
                variant={i === 0 ? 'ivory' : 'default'}
                className={cn(
                  "py-4 border-white/5 transition-all duration-500",
                  i === 0 ? "scale-[1.02] shadow-2xl z-10" : "bg-white/[0.02] hover:bg-white/[0.04]"
                )}
              >
                <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 gap-8 relative z-10">
                  <div className="flex items-center gap-10 w-full md:w-auto">
                  <div className="flex items-center gap-4">
                     <span className={cn(
                       "text-5xl font-semibold tabular-nums tracking-tighter"
                     )} style={i === 0 ? { color: '#1A1A1A' } : { color: 'white' }}>
                       {i + 1}
                     </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div 
                      className="w-1 h-10 rounded-full shadow-sm"
                      style={{ backgroundColor: team.color || '#C5A059' }} 
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium" style={i === 0 ? { color: '#1A1A1A', opacity: 0.6 } : { color: 'rgba(255,255,255,0.6)' }}>Team</p>
                      <h2 className="text-3xl font-semibold tracking-tight" style={i === 0 ? { color: '#1A1A1A' } : { color: 'white' }}>{team.name}</h2>
                    </div>
                  </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-16 w-full md:w-auto border-t md:border-t-0 border-black/5 pt-6 md:pt-0">
                  <div className="space-y-0.5 text-center md:text-right">
                     <p className="text-xs font-medium" style={i === 0 ? { color: '#1A1A1A', opacity: 0.6 } : { color: 'rgba(255,255,255,0.6)' }}>Progress</p>
                     <p className="text-lg font-semibold" style={i === 0 ? { color: '#1A1A1A' } : { color: 'rgba(255,255,255,0.8)' }}>{team.completedGames} Games</p>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <p className="text-xs font-medium" style={i === 0 ? { color: '#1A1A1A', opacity: 0.6 } : { color: 'rgba(255,255,255,0.6)' }}>Total Time</p>
                    <div className="flex items-baseline gap-3">
                       <span className="text-5xl font-semibold tabular-nums tracking-tighter" style={i === 0 ? { color: '#1A1A1A' } : { color: 'white' }}>{formatSeconds(team.gameTotal)}</span>
                    </div>
                  </div>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
           <div className="flex items-center gap-3">
              <span className="text-xl font-semibold tracking-tight text-white">RaceOps</span>
              <span className="text-xs font-medium text-muted-foreground opacity-40">2026</span>
           </div>
           <p className="text-xs font-medium text-muted-foreground/60 max-w-sm leading-relaxed">
              Official scoring for Infosoft Amazing Race 2026. Data is refreshed automatically.
           </p>
        </div>
      </PageSection>
    </main>
  );
}
