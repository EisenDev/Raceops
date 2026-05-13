import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Users, Calendar } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateFacilitatorModal } from '@/components/modules/users/create-facilitator-modal';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <PageSection className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <SectionHeader 
          title="Users & Facilitators" 
          description="Manage system access and staff roles."
          className="pb-0"
        />
        <CreateFacilitatorModal />
      </div>

      {users.length === 0 ? (
        <EmptyState 
          title="No users found"
          description="This shouldn't happen as the admin should exist."
          icon={<Users size={32} />}
        />
      ) : (
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="divide-y divide-[#1A1A1A]/5">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white hover:bg-[#F9F9F9] transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[#1A1A1A]/5 p-3 rounded-2xl">
                    <ShieldCheck size={20} className={user.role === 'ADMIN' ? 'text-[#1A1A1A]' : 'text-[#666666]'} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">{user.name}</h4>
                    <p className="text-xs text-[#666666] font-medium tracking-tight">{user.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 sm:gap-8 ml-12 sm:ml-0">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Role</p>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'muted'}>{user.role}</Badge>
                  </div>
                  
                  <div className="space-y-1 hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Joined</p>
                    <div className="flex items-center text-xs font-bold text-[#666666]">
                      <Calendar size={12} className="mr-1.5 opacity-50" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="h-10 px-4 font-bold text-xs">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageSection>
  );
}
