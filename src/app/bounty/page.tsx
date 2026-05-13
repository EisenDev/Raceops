import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Target } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';

export const dynamic = 'force-dynamic';

export default async function BountyPage() {
  const teams = await db.team.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <PageSection className="py-4">
      <SectionHeader 
        title="Bounty System" 
        description="Strategic high-value team scoring. One bounty per team."
      />

      {teams.length === 0 ? (
        <EmptyState 
          title="No teams registered"
          description="Register teams first to enable the bounty system."
          icon={<Target size={32} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="border-none shadow-sm group hover:border-[#1A1A1A]/10 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg uppercase font-black tracking-tight">{team.name}</CardTitle>
                <Target size={20} className="text-[#999999] group-hover:text-[#1A1A1A] transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/5 mt-4">
                  <Badge variant="muted">Available</Badge>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-[#999999]">Value</p>
                    <p className="font-black text-[#1A1A1A]">100 pts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 bg-[#F9F9F9] rounded-3xl p-8 border border-[#1A1A1A]/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A] mb-4">Implementation Note</h3>
        <p className="text-sm text-[#666666] leading-relaxed max-w-2xl font-medium">
          The bounty system is team-based. Each team has one unique high-value bounty. Successful claims award 100 points. Management and scanning tools will be enabled in the next phase.
        </p>
      </div>
    </PageSection>
  );
}
