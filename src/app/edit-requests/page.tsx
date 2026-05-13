import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { getCurrentUser } from '@/lib/session';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { History } from 'lucide-react';
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
    <PageSection className="py-4">
      <SectionHeader 
        title="Edit Requests" 
        description={isAdmin 
          ? "Review and approve score correction requests from facilitators."
          : "Track the status of your score correction requests."
        }
      />

      {requests.length === 0 ? (
        <EmptyState 
          title="No edit requests"
          description={isAdmin 
            ? "Facilitator score corrections will appear here for admin approval."
            : "You haven't submitted any correction requests yet."
          }
          icon={<History size={32} />}
        />
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <RequestCard 
              key={req.id} 
              request={req} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
      )}
    </PageSection>
  );
}
