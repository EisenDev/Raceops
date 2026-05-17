import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Zap, Shield, Info, HardDrive, LayoutGrid } from 'lucide-react';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TeamScanner } from '@/components/modules/techops/team-scanner';
import { CardInventory } from '@/components/modules/techops/card-inventory';
import { CardGenerator } from '@/components/modules/techops/card-generator';

export const dynamic = 'force-dynamic';

export default async function TechOpsRunPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  const [teams, cards] = await Promise.all([
    db.team.findMany({
      orderBy: { name: 'asc' },
      include: {
        scans: {
          include: {
            card: true
          }
        }
      }
    }),
    db.techOpsCard.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        usedByTeam: { select: { name: true } },
        generatedBy: { select: { name: true } },
      },
    }),
  ]);

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">TechOps</h1>
          <p className="text-sm text-muted-foreground font-medium">Record points for strategic card retrieval.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Operations */}
        <div className="lg:col-span-5 space-y-12">
          {isAdmin && (
            <div className="space-y-4">
               <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Setup</p>
               <Card variant="ivory" className="p-1 border-none shadow-sm">
                 <CardGenerator />
               </Card>
            </div>
          )}

          <div className="space-y-6">
             <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Team scanners</p>
             <div className="space-y-4">
                {teams.map(team => (
                  <TeamScanner key={team.id} team={team} />
                ))}
             </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
             <div className="flex items-center gap-2 text-accent opacity-80">
                <Info size={16} />
                <p className="text-xs font-semibold uppercase tracking-widest">Notice</p>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Points are awarded for valid card discovery. Scan the unique code to record points for a team.
             </p>
          </div>
        </div>

        {/* Right: Data View */}
        <div className="lg:col-span-7 space-y-10">
           <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Card history</p>
              <CardInventory cards={cards} isAdmin={isAdmin} />
           </div>
        </div>
      </div>
    </PageSection>
  );
}
