import db from '@/lib/db';
import { getRecentAttempts, getCodeChallenges } from '@/lib/actions/code-runner';
import { getCurrentUser } from '@/lib/session';
import { CodeRunnerShell } from '@/components/modules/code-runner/code-runner-shell';

export const dynamic = 'force-dynamic';

export default async function CodeRunnerPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const [teams, challenges, attempts, dbUser] = await Promise.all([
    db.team.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    }),
    getCodeChallenges(),
    getRecentAttempts(),
    user ? db.user.findUnique({
      where: { id: user.id },
      include: { assignedTeams: true }
    }) : null
  ]);

  const assignedTeam = !isAdmin ? dbUser?.assignedTeams[0] || null : null;

  return (
    <CodeRunnerShell 
      teams={teams} 
      challenges={challenges} 
      attempts={attempts} 
      isAdmin={isAdmin}
      assignedTeam={assignedTeam}
    />
  );
}
