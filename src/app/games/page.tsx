import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCurrentUser } from '@/lib/session';
import { AddGameModal } from '@/components/modules/games/add-game-modal';
import { EditGameModal } from '@/components/modules/games/edit-game-modal';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const games = await db.game.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { gameScores: true }
      }
    }
  });

  return (
    <PageSection className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <SectionHeader 
          title="Amazing Race Games" 
          description="Manage regular games and record team performance."
          className="pb-0"
        />
        {isAdmin && <AddGameModal />}
      </div>

      {games.length === 0 ? (
        <EmptyState 
          title="No games added yet"
          description="Click the button above to create your first Amazing Race game."
          icon={<Gamepad2 size={32} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="h-full flex flex-col group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Link href={`/games/${game.id}`} className="bg-[#F9F9F9] p-3 rounded-xl text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                    <Gamepad2 size={24} strokeWidth={1.5} />
                  </Link>
                  <Badge variant={game.status === 'ACTIVE' ? 'success' : 'muted'}>{game.status}</Badge>
                </div>
                <Link href={`/games/${game.id}`} className="block hover:underline">
                  <CardTitle className="pt-4">{game.name}</CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Max Points</span>
                    <span className="font-bold">{game.maxPoints}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666666]">Scored Teams</span>
                    <span className="font-bold">{game._count.gameScores} / 9</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#1A1A1A]/5 mt-4 flex justify-between items-center">
                <Link href={`/games/${game.id}`} className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider hover:underline">Open Scoring</Link>
                {isAdmin && <EditGameModal game={game} />}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageSection>
  );
}
