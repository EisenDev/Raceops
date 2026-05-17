import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Users, Calendar, Key } from 'lucide-react';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateFacilitatorModal } from '@/components/modules/users/create-facilitator-modal';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Staff</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage system access and personnel roles.</p>
        </div>
        <CreateFacilitatorModal />
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
            {users.map((user) => (
              <div key={user.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/[0.02] transition-all gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{user.name}</h4>
                    <p className="text-xs text-muted-foreground opacity-60">{user.username}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 sm:gap-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-muted-foreground opacity-40 uppercase tracking-widest">Role</p>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'muted'} className="px-2 py-0">
                       {user.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 hidden lg:block">
                    <p className="text-[10px] font-medium text-muted-foreground opacity-40 uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-medium text-white/70">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <Button variant="ghost" size="sm" className="text-xs h-10 px-4">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageSection>
  );
}
