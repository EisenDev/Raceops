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
      <Card className="p-8 text-center bg-[#F9F9F9]/50 border-dashed border-2 border-[#1A1A1A]/5 rounded-2xl">
         <p className="text-[10px] font-semibold text-[#999999] leading-relaxed">
            No attempts in this session.
         </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
         <h3 className="text-[10px] font-semibold text-[#999999]">Recent attempts</h3>
      </div>
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <Card key={attempt.id} className="p-5 border-none shadow-sm hover:shadow-md transition-all bg-white">
            <div className="flex justify-between items-start gap-4">
               <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                    attempt.accepted ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                  )}>
                    {attempt.accepted ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tracking-tight text-[#1A1A1A]">{attempt.team.name}</span>
                        <Badge variant="muted" className="text-[8px] font-semibold px-1.5 py-0">
                           {attempt.languageTrack}
                        </Badge>
                     </div>
                     <p className="text-[10px] font-semibold text-[#999999] flex items-center gap-1.5">
                        <Code size={10} />
                        {attempt.challenge ? attempt.challenge.title : 'No challenge match'}
                     </p>
                  </div>
               </div>
               <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-1.5 text-[#999999]">
                     <Clock size={10} />
                     <span className="text-[9px] font-semibold">{new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-[#999999]">
                     <UserIcon size={10} />
                     <span className="text-[9px] font-semibold tracking-tighter truncate max-w-[80px]">{attempt.submittedBy.name}</span>
                  </div>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
