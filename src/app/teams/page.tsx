import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCurrentUser } from '@/lib/session';
import { AddTeamModal } from '@/components/modules/teams/add-team-modal';
import { EditTeamModal } from '@/components/modules/teams/edit-team-modal';
import { AddMemberModal } from '@/components/modules/teams/add-member-modal';
import { DeleteMemberButton } from '@/components/modules/teams/delete-member-button';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const teams = await db.team.findMany({
    orderBy: { name: 'asc' },
    include: {
      members: {
        orderBy: { name: 'asc' }
      }
    }
  });

  return (
    <PageSection className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <SectionHeader 
          title="Teams & Members" 
          description="Manage teams and individual participants."
          className="pb-0"
        />
        {isAdmin && <AddTeamModal />}
      </div>

      {teams.length === 0 ? (
        <EmptyState 
          title="No teams registered"
          description="Add teams to start managing members and scoring."
          icon={<Users size={32} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team) => (
            <Card key={team.id} className="border-none shadow-sm h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-black uppercase tracking-tight">{team.name}</CardTitle>
                {isAdmin && <EditTeamModal team={team} />}
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Members ({team.members.length})</p>
                    {isAdmin && <AddMemberModal teamId={team.id} teamName={team.name} />}
                  </div>
                  {team.members.length === 0 ? (
                    <div className="py-8 text-center bg-[#F9F9F9]/50 rounded-xl border border-dashed border-[#1A1A1A]/5">
                      <p className="text-xs font-bold text-[#999999] uppercase tracking-widest">No members yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F9F9F9] border border-[#1A1A1A]/5 group transition-all hover:bg-white hover:shadow-sm">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: team.color || '#1A1A1A' }} 
                            />
                            <span className="text-sm font-bold">{member.name}</span>
                          </div>
                          {isAdmin && <DeleteMemberButton memberId={member.id} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageSection>
  );
}
