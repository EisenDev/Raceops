import { PageSection } from '@/components/ui/PageSection';
import db from '@/lib/db';
import { Cpu } from 'lucide-react';
import Compiler from '@/components/modules/techops/compiler';

export const dynamic = 'force-dynamic';

export default async function CompilerPage() {
  const cards = await db.techOpsCard.findMany({
    orderBy: { code: 'asc' },
    select: { code: true, label: true, type: true }
  });

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">System Compiler</h1>
          <p className="text-sm text-muted-foreground font-medium">Verify card codes before team assignment.</p>
        </div>
      </div>

      <Compiler cards={cards} />
    </PageSection>
  );
}
