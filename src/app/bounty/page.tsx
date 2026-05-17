import { PageSection } from '@/components/ui/PageSection';
import { BountyList } from '@/components/modules/bounty/BountyList';
import { BountyClaimForm } from '@/components/modules/bounty/BountyClaimForm';
import { BountySetupPanel } from '@/components/modules/bounty/BountySetupPanel';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { Target, Shield, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BountyPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  const [bounties, teams] = await Promise.all([
    db.bounty.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        team: { select: { name: true } },
        claimedByTeam: { select: { name: true } },
      },
    }),
    db.team.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <PageSection className="py-4 pb-24">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Bounty</h1>
          <p className="text-sm text-muted-foreground font-medium">Record and manage target code claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Actions */}
        <div className="lg:col-span-4 space-y-12">
          {isAdmin && (
            <div className="space-y-4">
               <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Setup</p>
               <BountySetupPanel />
            </div>
          )}

          <div className="space-y-4">
             <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Claim bounty</p>
             <BountyClaimForm teams={teams} />
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
             <div className="flex items-center gap-2 text-accent opacity-80">
                <Info size={16} />
                <p className="text-xs font-semibold uppercase tracking-widest">Rules</p>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Teams earn 100 points for each valid target code claimed.
             </p>
          </div>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-8 space-y-6">
           <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">History</p>
           <BountyList bounties={bounties} isAdmin={isAdmin} />
        </div>
      </div>
    </PageSection>
  );
}
