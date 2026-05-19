'use client';

import { useActionState, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { runCodeRunner } from '@/lib/actions/code-runner';
import { Terminal, CheckCircle2, XCircle, Loader2, Info, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

import { CodeEditor } from './CodeEditor';

interface CodeRunnerFormProps {
  teams: { id: string, name: string }[];
  selectedLanguage: string;
  assignedTeam?: { id: string, name: string } | null;
}

export function CodeRunnerForm({ teams, selectedLanguage, assignedTeam }: CodeRunnerFormProps) {
  const [state, action, isPending] = useActionState(runCodeRunner, null);
  const [code, setCode] = useState('');
  const [teamId, setTeamId] = useState(assignedTeam?.id || '');

  const isLocked = !!assignedTeam;

  return (
    <div className="space-y-8">
      <Card className="p-8 border-white/5 bg-white/[0.02]">
        <form action={action} className="space-y-8">
          <input type="hidden" name="languageTrack" value={selectedLanguage} />
          <input type="hidden" name="submittedCode" value={code} />

          {!isLocked && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Team</label>
              <select 
                name="teamId" 
                required
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full h-12 px-5 rounded-xl border border-white/10 bg-black text-white text-sm font-medium focus:border-accent/40 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id} className="bg-[#141414]">{team.name}</option>
                ))}
              </select>
            </div>
          )}

          {isLocked && (
            <div className="space-y-2">
              <input type="hidden" name="teamId" value={teamId} />
              <label className="text-xs font-medium text-muted-foreground ml-1">Active Team</label>
              <div className="w-full h-12 flex items-center px-5 rounded-xl border border-white/10 bg-black/40 text-white/60 text-sm font-medium">
                {assignedTeam.name}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Submission code</label>
            <div className="rounded-2xl border border-white/10 bg-black overflow-hidden focus-within:border-accent/40 transition-all">
              <CodeEditor 
                language={selectedLanguage}
                value={code}
                onChange={setCode}
                placeholder="// Paste the code here..."
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isPending || !teamId || !code}
            className="w-full h-14 rounded-xl text-sm font-semibold"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Submit code</span>
            )}
          </Button>

          {state?.error && (
            <StatusMessage variant="error" title="Submission error" message={state.error} />
          )}
        </form>
      </Card>

      {/* Result Panel */}
      {state && !state.error && (
        <Card variant="ivory" className={cn(
          "overflow-hidden border-none shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-500 rounded-2xl"
        )}>
           <div className={cn(
             "px-8 py-4 flex items-center justify-between border-b border-black/5",
             state.status === 200 ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-700"
           )}>
              <div className="flex items-center gap-3">
                 {state.status === 200 ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                 <span className="text-sm font-semibold">
                   {state.status === 200 ? 'Accepted' : 'Rejected'}
                 </span>
              </div>
              <span className="text-[10px] font-semibold opacity-40 font-mono">Response</span>
           </div>

           <div className="p-8 space-y-8">
              <div className="space-y-1">
                 <p className="text-[10px] font-semibold opacity-40">Result</p>
                 <p className={cn(
                   "text-4xl font-semibold tracking-tight",
                   state.status === 200 ? "text-emerald-600" : "text-red-600"
                 )}>{state.result}</p>
                 {state.message && <p className="text-sm font-medium opacity-60 italic">{state.message}</p>}
              </div>

              {state.output && (
                <div className="space-y-2 pt-6 border-t border-black/5">
                   <p className="text-[10px] font-semibold opacity-40">Output</p>
                   <div className="bg-black/5 p-5 rounded-xl text-black/80 text-sm font-mono leading-relaxed border border-black/5">
                      {state.output}
                   </div>
                </div>
              )}

              {state.hint && (
                <div className="space-y-2 pt-6 border-t border-black/5">
                   <p className="text-[10px] font-semibold opacity-40">Hint</p>
                   <p className="text-sm text-red-700/80 font-medium italic bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                      {state.hint}
                   </p>
                </div>
              )}
           </div>
        </Card>
      )}

      <div className="flex items-start gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
         <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
         <p className="text-sm text-blue-100/60 leading-relaxed font-medium">
            The code runner checks for specific patterns and logic. No live execution is performed.
         </p>
      </div>
    </div>
  );
}
