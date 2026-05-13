import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Trophy, RefreshCcw, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ScoresPage() {
  const teams = await db.team.findMany({
    orderBy: { totalScore: 'desc' },
    include: {
      gameScores: true,
    }
  });

  return (
    <PageSection className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <SectionHeader 
          title="Team Standings" 
          description="Review and manage total scores across all categories."
          className="pb-0"
        />
        <div className="flex gap-3">
           <Button variant="outline" size="sm">
             <RefreshCcw size={16} className="mr-2" />
             Refresh
           </Button>
           <Button variant="primary" size="sm">
             <Lock size={16} className="mr-2" />
             Final Lock
           </Button>
        </div>
      </div>

      {teams.length === 0 ? (
        <EmptyState 
          title="No scoring data"
          description="Scores will be calculated automatically once games are recorded."
          icon={<Trophy size={32} />}
        />
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left">
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-[#999999]">Rank</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-[#999999]">Team</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-[#999999] text-center">Games</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-[#999999] text-center">TechOps</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-[#999999] text-center">Bounty</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-[#999999] text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => {
                const gamesTotal = team.gameScores.reduce((sum, s) => sum + s.totalPoints, 0);
                
                return (
                  <tr key={team.id} className="group transition-all">
                    <td className="bg-[#F9F9F9] first:rounded-l-2xl px-6 py-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                      <div className="flex items-center gap-2">
                        {i === 0 && <Trophy size={16} className="text-yellow-500" />}
                        <span className="font-black text-lg">{i + 1}</span>
                      </div>
                    </td>
                    <td className="bg-white border-y border-[#1A1A1A]/5 px-4 py-5 font-bold uppercase tracking-tight">{team.name}</td>
                    <td className="bg-white border-y border-[#1A1A1A]/5 px-4 py-5 text-center font-medium text-[#666666]">{gamesTotal}</td>
                    <td className="bg-white border-y border-[#1A1A1A]/5 px-4 py-5 text-center font-medium text-[#666666]">{team.techOpsScore}</td>
                    <td className="bg-white border-y border-[#1A1A1A]/5 px-4 py-5 text-center font-medium text-[#666666]">{team.bountyScore}</td>
                    <td className="bg-[#F9F9F9] last:rounded-r-2xl px-6 py-5 text-right">
                      <span className="text-xl font-black tabular-nums">{team.totalScore}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4 items-start">
             <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Individual game breakdowns are not shown here. Visit the <strong>Games</strong> or <strong>TechOps</strong> tabs to view detailed card and game logs for each team.
             </p>
          </div>
        </div>
      )}
    </PageSection>
  );
}
