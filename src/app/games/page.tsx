import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import db from '@/lib/db';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCurrentUser } from '@/lib/session';
import { AddGameModal } from '@/components/modules/games/add-game-modal';
import { EditGameModal } from '@/components/modules/games/edit-game-modal';
import { isScoresLocked } from '@/lib/actions/settings';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';
  const isLocked = await isScoresLocked();

  const games = await db.game.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { gameScores: true }
      }
    }
  });

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Games</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage and record scores for all event missions.</p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && !isLocked && <AddGameModal />}
          {isAdmin && isLocked && (
            <Badge variant="error" className="px-4 py-1.5 font-semibold">Locked</Badge>
          )}
        </div>
      </div>

      {games.length === 0 ? (
        <EmptyState 
          title="No games active"
          description="Create your first game to start tracking scores."
          icon={<Gamepad2 size={40} className="text-muted-foreground/20" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div key={game.id} className="relative group">
              <Link href={`/games/${game.id}`} className="absolute inset-0 z-10" />
              <Card className="h-full flex flex-col transition-all duration-300 group-hover:bg-white/[0.04] p-0 overflow-hidden border-white/5">
                <div className="p-8 pb-6 flex-1">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all shadow-lg">
                      <Gamepad2 size={24} />
                    </div>
                    <Badge variant={game.status === 'ACTIVE' ? 'success' : 'muted'}>
                      {game.status === 'ACTIVE' ? 'Live' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-8">
                     <h3 className="text-xl font-semibold text-white transition-all">{game.name}</h3>
                     <p className="text-xs text-muted-foreground font-medium">Mission detail</p>
                  </div>

                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-medium text-muted-foreground opacity-60">Recorded scores</span>
                    <p className="text-base font-semibold text-white">{game._count.gameScores}</p>
                  </div>
                </div>

                <div className="p-6 bg-black/20 border-t border-white/5 flex justify-between items-center relative z-20">
                  <span className="text-xs font-medium text-accent">Open scoring</span>
                  {isAdmin && (
                    <EditGameModal game={game} disabled={isLocked} />
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </PageSection>
  );
}
