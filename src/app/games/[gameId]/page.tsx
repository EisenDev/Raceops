import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Info } from 'lucide-react';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { EditGameModal } from '@/components/modules/games/edit-game-modal';
import { getCurrentUser } from '@/lib/session';
import { TeamScoringCard } from '@/components/modules/games/team-scoring-card';

export const dynamic = 'force-dynamic';

interface GameDetailPageProps {
  params: Promise<{ gameId: string }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameId } = await params;
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';
  
  const game = await db.game.findUnique({
    where: { id: gameId },
    include: {
      gameScores: {
        include: {
          memberScores: true
        }
      }
    }
  });

  if (!game) {
    notFound();
  }

  const teams = await db.team.findMany({
    include: {
      members: true
    },
    orderBy: { name: 'asc' }
  });

  return (
    <PageSection spacing="lg" className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <SectionHeader 
          title={game.name} 
          description={`Maximum possible points: ${game.maxPoints}`}
          className="pb-0"
        />
        <div className="flex gap-2">
          <Badge variant={game.status === 'ACTIVE' ? 'success' : 'muted'}>{game.status}</Badge>
          {isAdmin && <EditGameModal game={game} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#999999] px-2">Team Scoring</h3>
          
          {teams.length === 0 ? (
            <EmptyState 
              title="No teams found"
              description="Register teams first to enable scoring for this game."
              className="bg-white rounded-3xl border border-[#1A1A1A]/5"
            />
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <TeamScoringCard 
                  key={team.id}
                  game={game}
                  team={team}
                  isAdmin={isAdmin}
                  existingScore={game.gameScores.find(s => s.teamId === team.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#999999] px-2">Game Mechanics</h3>
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 prose prose-sm leading-relaxed text-[#666666]">
              {game.mechanics ? (
                <div className="whitespace-pre-wrap font-medium text-sm leading-relaxed">{game.mechanics}</div>
              ) : (
                <p className="italic text-[#999999]">No mechanics defined for this game yet.</p>
              )}
            </CardContent>
          </Card>
          
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4 items-start">
             <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Facilitators can record scores once. Further edits require an Admin correction request.
             </p>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
