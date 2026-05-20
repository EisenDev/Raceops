import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Info } from 'lucide-react';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { EditGameModal } from '@/components/modules/games/edit-game-modal';
import { getCurrentUser } from '@/lib/session';
import { TeamScoringCard } from '@/components/modules/games/team-scoring-card';
import { isScoresLocked } from '@/lib/actions/settings';

export const dynamic = 'force-dynamic';

interface GameDetailPageProps {
  params: Promise<{ gameId: string }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameId } = await params;
  
  const [user, isLocked] = await Promise.all([
    getCurrentUser(),
    isScoresLocked()
  ]);

  const isAdmin = user?.role === 'ADMIN';
  
  const [game, pendingRequests, teams] = await Promise.all([
    db.game.findUnique({
      where: { id: gameId },
      include: {
        gameScores: {
          include: {
            memberScores: true
          }
        }
      }
    }),
    db.editRequest.findMany({
      where: { 
        module: 'GAME_SCORE',
        status: 'PENDING'
      }
    }),
    db.team.findMany({
      include: {
        members: true,
      },
      orderBy: { name: 'asc' }
    })
  ]);

  if (!game) {
    notFound();
  }

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white">{game.name}</h1>
              <Badge variant={game.status === 'ACTIVE' ? 'success' : 'muted'} className="px-2 py-0">
                {game.status === 'ACTIVE' ? 'Live' : 'Inactive'}
              </Badge>
           </div>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && <EditGameModal game={game} disabled={isLocked} />}
          {isLocked && (
            <Badge variant="error" className="px-3 py-1 font-semibold">Locked</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Game performance logs</p>
          
          {teams.length === 0 ? (
            <EmptyState 
              title="No teams registered"
              description="Register teams in the registry to start recording scores for this game."
              className="bg-white/[0.02] border-white/5 py-24"
            />
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <TeamScoringCard 
                  key={team.id}
                  game={game}
                  team={team}
                  isAdmin={isAdmin}
                  currentUser={user as { id: string; role: 'ADMIN' | 'FACILITATOR' }} 
                  existingScore={game.gameScores.find(s => s.teamId === team.id)}
                  pendingRequest={pendingRequests.find(r => r.referenceId === game.gameScores.find(s => s.teamId === team.id)?.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">How to play</p>
            <Card variant="ivory" className="p-8 border-none shadow-xl">
              {game.mechanics ? (
                <div className="whitespace-pre-wrap font-medium text-sm leading-relaxed opacity-80">{game.mechanics}</div>
              ) : (
                <p className="italic opacity-40 text-sm">No mechanics defined for this game.</p>
              )}
            </Card>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
             <div className="flex items-center gap-3 text-accent opacity-80">
                <Info size={18} />
                <p className="text-xs font-semibold uppercase tracking-widest">Notice</p>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                You can only record scores for your assigned team. Once a score is saved, you must request an edit for any corrections.
             </p>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
