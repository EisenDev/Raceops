import { PageSection } from '@/components/ui/PageSection';
import { getCurrentUser } from '@/lib/session';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { History, ShieldAlert } from 'lucide-react';
import { RequestCard } from '@/components/modules/edit-requests/request-card';

export const dynamic = 'force-dynamic';

export default async function EditRequestsPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const requests = await db.editRequest.findMany({
    where: isAdmin ? {} : { requestedById: user?.id },
    orderBy: { createdAt: 'desc' },
    include: {
      team: true,
      requestedBy: true
    }
  });

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Edit Requests</h1>
          <p className="text-sm text-muted-foreground font-medium">Correction requests for saved mission scores.</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState 
          title="No pending requests"
          description="Correction requests will appear here for review."
          icon={<History size={40} className="text-muted-foreground/20" />}
        />
      ) : (
        <div className="space-y-8 max-w-4xl">
          <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Correction queue</p>
          <div className="space-y-4">
            {requests.map((req) => (
              <RequestCard 
                key={req.id} 
                request={req} 
                isAdmin={isAdmin} 
              />
            ))}
          </div>
        </div>
      )}
    </PageSection>
  );
}
