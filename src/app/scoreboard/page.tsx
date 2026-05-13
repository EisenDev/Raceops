import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Trophy, MapPin } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PublicScorePage() {
  const teams = await db.team.findMany({
    orderBy: {
      totalScore: 'desc'
    }
  });

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 lg:p-24">
      <PageSection spacing="lg" className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-[#1A1A1A]/10 pb-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] text-white rounded-full">
                <MapPin size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Scoreboard</span>
             </div>
             <SectionHeader 
               title="Infosoft Amazing Race 2026" 
               description="Real-time rankings and team standings."
               className="pb-0"
             />
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#999999]">Status</p>
             <p className="text-xl font-black text-[#1A1A1A]">Official Rankings</p>
          </div>
        </div>

        {teams.length === 0 ? (
          <EmptyState 
            title="No teams registered"
            description="The race standings will appear here once teams are added to the system."
            icon={<Trophy size={32} />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="hidden md:grid grid-cols-12 px-8 text-[10px] font-black uppercase tracking-widest text-[#999999]">
              <div className="col-span-1">Rank</div>
              <div className="col-span-6">Team</div>
              <div className="col-span-5 text-right">Grand Total</div>
            </div>

            {teams.map((team, i) => (
              <Card key={team.id} className={cn(
                "border-none shadow-none py-2 transition-all",
                i === 0 ? "bg-[#1A1A1A] text-white shadow-xl scale-[1.02]" : "bg-[#F9F9F9]"
              )}>
                <div className="grid grid-cols-4 md:grid-cols-12 items-center px-6 md:px-8 py-4 gap-4">
                  <div className="col-span-1 flex items-center gap-2">
                    <span className="text-2xl font-black tabular-nums">{i + 1}</span>
                    {i === 0 && <Trophy size={20} className="text-yellow-400" />}
                  </div>
                  <div className="col-span-2 md:col-span-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                        style={{ backgroundColor: team.color || '#1A1A1A' }} 
                      />
                      <span className="text-lg font-black tracking-tight uppercase truncate">{team.name}</span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-5 text-right">
                    <span className="text-2xl md:text-4xl font-black tabular-nums">{team.totalScore}</span>
                    <span className="text-[10px] font-bold uppercase ml-2 opacity-50">PTS</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-24 pt-8 border-t border-[#1A1A1A]/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
           <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Powered By</p>
              <p className="text-sm font-black tracking-[0.4em] text-[#1A1A1A]">RACEOPS</p>
           </div>
           <p className="text-[10px] font-bold text-[#999999] max-w-xs leading-relaxed uppercase tracking-widest">
              Official live scoring for Infosoft Amazing Race 2026.
           </p>
        </div>
      </PageSection>
    </main>
  );
}
