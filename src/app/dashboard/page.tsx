import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageSection } from '@/components/ui/PageSection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Trophy, Gamepad2, QrCode, History } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [teamCount, gameCount, cardGeneratedCount, scanCount, editRequestCount, topTeams] = await Promise.all([
    db.team.count(),
    db.game.count(),
    db.techOpsCard.count(),
    db.techOpsScan.count(),
    db.editRequest.count({ where: { status: 'PENDING' } }),
    db.team.findMany({
      orderBy: { totalScore: 'desc' },
      take: 3
    })
  ]);

  const stats = [
    { label: "Total Teams", value: teamCount.toString(), icon: Trophy },
    { label: "Games Added", value: gameCount.toString(), icon: Gamepad2 },
    { label: "Cards Scanned", value: scanCount.toString(), icon: QrCode },
    { label: "Pending Edits", value: editRequestCount.toString(), icon: History },
  ];

  return (
    <PageSection className="py-4">
      <SectionHeader 
        title="Infosoft Amazing Race 2026" 
        description="Event dashboard and real-time operations summary."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <MetricCard 
            key={i}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        <Card className="border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle>Leaderboard Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {topTeams.length === 0 ? (
              <EmptyState 
                title="No rankings yet"
                description="Teams will appear here once they start scoring points."
                className="py-6"
              />
            ) : (
              <div className="space-y-4">
                {topTeams.map((team, i) => (
                  <div key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="text-xs font-black text-[#999999]">#0{i+1}</span>
                       <span className="font-bold uppercase tracking-tight">{team.name}</span>
                    </div>
                    <span className="text-xl font-black">{team.totalScore} pts</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>TechOps Stats</CardTitle>
            <QrCode size={16} className="text-[#999999]" />
          </CardHeader>
          <CardContent className="pt-4">
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Inventory Status</p>
                   <p className="text-2xl font-black">{cardGeneratedCount}</p>
                </div>
                <div className="h-2 w-full bg-[#F9F9F9] rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-[#1A1A1A] transition-all duration-500" 
                     style={{ width: `${cardGeneratedCount > 0 ? (scanCount / cardGeneratedCount) * 100 : 0}%` }}
                   />
                </div>
                <p className="text-[10px] font-bold text-[#666666] uppercase">{scanCount} cards claimed out of {cardGeneratedCount} total generated.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </PageSection>
  );
}
