import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { CardGenerator } from '@/components/modules/techops/card-generator';
import { TeamScanner } from '@/components/modules/techops/team-scanner';
import { CardInventory } from '@/components/modules/techops/card-inventory';

export const dynamic = 'force-dynamic';

export default async function TechOpsRunPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const [teams, cards] = await Promise.all([
    db.team.findMany({
      orderBy: { name: 'asc' },
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          include: {
            card: true
          }
        }
      }
    }),
    db.techOpsCard.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        usedByTeam: true
      }
    })
  ]);

  return (
    <PageSection spacing="lg" className="py-4 pb-20">
      <SectionHeader 
        title="TechOps Cache Run" 
        description="Official scavenger hunt management and card processing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#999999] px-2">Active Team Scanners</h3>
          <div className="grid grid-cols-1 gap-4">
            {teams.map((team) => (
              <TeamScanner key={team.id} team={team} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {isAdmin && <CardGenerator />}
        </div>
      </div>

      <div className="pt-12 border-t border-[#1A1A1A]/5">
        <CardInventory cards={cards} isAdmin={isAdmin} />
      </div>
    </PageSection>
  );
}
