import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, User as UserIcon, Code } from 'lucide-react';
import { Team, CodeChallenge, User, CodeRunnerAttempt } from '@prisma/client';

interface AttemptHistoryProps {
  attempts: (CodeRunnerAttempt & {
    team: Team;
    challenge: CodeChallenge | null;
    submittedBy: User;
  })[];
}

export function AttemptHistory({ attempts }: AttemptHistoryProps) {
  if (attempts.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl border border-white/5 bg-white/[0.02]">
         <p className="text-xs font-medium text-muted-foreground opacity-40 leading-relaxed italic">
            No attempts logged in this session.
         </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
            <div className="flex justify-between items-start gap-4">
               <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    attempt.accepted ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {attempt.accepted ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-white">{attempt.team.name}</span>
                        <Badge className={cn(
                          "text-[9px] font-bold px-1.5 py-0 border-none",
                          attempt.accepted ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        )}>
                           {attempt.languageTrack}
                        </Badge>
                     </div>
                     <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
                        <Code size={10} className="opacity-40" />
                        <span className="truncate max-w-[140px]">
                          {attempt.challenge ? attempt.challenge.title : 'No logic match'}
                        </span>
                     </p>
                  </div>
               </div>
               <div className="text-right space-y-1 shrink-0">
                  <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                     <Clock size={10} className="opacity-40" />
                     <span className="text-[10px] font-medium">{new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                     <UserIcon size={10} className="opacity-40" />
                     <span className="text-[10px] font-medium tracking-tight truncate max-w-[80px]">{attempt.submittedBy.name}</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
