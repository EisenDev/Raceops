import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Users, Calendar, Key, UserCog } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateFacilitatorModal } from '@/components/modules/users/create-facilitator-modal';
import { EditUserModal } from '@/components/modules/users/edit-user-modal';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'ADMIN';

  // Fetch all users for admin, but allow facilitator to see the list (to know who others are)
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Staff Registry</h1>
          <p className="text-sm text-muted-foreground font-medium">
            {isAdmin 
              ? 'Manage system access and personnel roles.' 
              : 'View system staff and manage your account details.'}
          </p>
        </div>
        {isAdmin && <CreateFacilitatorModal />}
      </div>

      {users.length === 0 ? (
        <EmptyState 
          title="No users found"
          description="Registry is empty."
          icon={<Users size={40} className="text-muted-foreground/20" />}
        />
      ) : (
        <Card className="p-0 border-white/5 bg-white/[0.01] overflow-hidden rounded-xl">
          <div className="divide-y divide-white/5">
            {users.map((user) => {
              const canEdit = isAdmin || currentUser.id === user.id;
              
              return (
                <div key={user.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/[0.02] transition-all gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      user.role === 'ADMIN' ? "bg-accent/10 text-accent" : "bg-white/5 text-muted-foreground"
                    )}>
                      {user.role === 'ADMIN' ? <ShieldCheck size={20} /> : <UserCog size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-white">{user.name}</h4>
                        {currentUser.id === user.id && (
                          <Badge variant="success" className="text-[8px] font-black uppercase px-1.5 py-0">You</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground opacity-60">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-8 sm:gap-12">
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-muted-foreground opacity-40 uppercase tracking-widest">Role</p>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'muted'} className="px-2 py-0 border-none">
                         {user.role}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 hidden lg:block">
                      <p className="text-[10px] font-medium text-muted-foreground opacity-40 uppercase tracking-widest">Joined</p>
                      <p className="text-sm font-medium text-white/70">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {canEdit ? (
                      <EditUserModal user={user} currentUser={currentUser} />
                    ) : (
                      <div className="w-[72px]" /> // Spacer to maintain alignment
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </PageSection>
  );
}
