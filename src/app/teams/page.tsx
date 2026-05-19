import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Shield, Fingerprint } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCurrentUser } from '@/lib/session';
import { AddTeamModal } from '@/components/modules/teams/add-team-modal';
import { EditTeamModal } from '@/components/modules/teams/edit-team-modal';
import { AddMemberModal } from '@/components/modules/teams/add-member-modal';
import { DeleteMemberButton } from '@/components/modules/teams/delete-member-button';
import { getSetting, isScoresLocked } from '@/lib/actions/settings';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';
  const isLocked = await isScoresLocked();
  const currentYearStr = await getSetting('currentYear') || '2026';
  const currentYear = parseInt(currentYearStr, 10);

  const [teams, facilitators] = await Promise.all([
    db.team.findMany({
      where: { eventYear: currentYear },
      orderBy: { name: 'asc' },
      include: {
        members: {
          orderBy: { name: 'asc' }
        },
        assignedFacilitator: true
      }
    }),
    db.user.findMany({
      where: { role: 'FACILITATOR' },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Teams</h1>
          <p className="text-sm text-muted-foreground font-medium">Registry of all units and assigned personnel.</p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && !isLocked && <AddTeamModal facilitators={facilitators} />}
          {isAdmin && isLocked && (
            <Badge variant="error" className="px-4 py-1.5 font-semibold">Registry Locked</Badge>
          )}
        </div>
      </div>

      {teams.length === 0 ? (
        <EmptyState 
          title="No teams registered"
          description="Register your first team to begin management."
          icon={<Users size={40} className="text-muted-foreground/20" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team) => (
            <Card key={team.id} className="p-0 border-white/5 overflow-hidden flex flex-col group hover:border-white/10 transition-all">
              <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-1 h-8 rounded-full" 
                    style={{ backgroundColor: team.color || '#C5A059' }} 
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">{team.name}</h3>
                    {team.assignedFacilitator && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                         Staff: {team.assignedFacilitator.name}
                      </div>
                    )}
                  </div>
                </div>
                {isAdmin && <EditTeamModal team={team} facilitators={facilitators} disabled={isLocked} />}
              </div>

              <div className="p-8 flex-1">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Personnel ({team.members.length})</p>
                    {isAdmin && !isLocked && <AddMemberModal teamId={team.id} teamName={team.name} />}
                  </div>

                  {team.members.length === 0 ? (
                    <div className="py-10 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/5">
                      <p className="text-xs text-muted-foreground/40 font-medium">No personnel assigned</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                          <span className="text-sm font-medium text-white/80">{member.name}</span>
                          {isAdmin && !isLocked && <DeleteMemberButton memberId={member.id} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageSection>
  );
}
