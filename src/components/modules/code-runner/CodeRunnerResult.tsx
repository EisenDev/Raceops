'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeRunnerResultProps {
  state: any;
}

export function CodeRunnerResult({ state }: CodeRunnerResultProps) {
  if (!state || state.error) return null;

  const isAccepted = state.status === 200;

  return (
    <Card 
      variant="ivory" 
      className={cn(
        "overflow-hidden border-none shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-500 rounded-2xl w-full",
        isAccepted ? "ring-1 ring-emerald-500/20" : "ring-1 ring-red-500/20"
      )}
    >
       <div className={cn(
         "px-8 py-4 flex items-center justify-between border-b border-black/5",
         isAccepted ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-700"
       )}>
          <div className="flex items-center gap-3">
             {isAccepted ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
             <span className="text-sm font-semibold tracking-wide">
               {isAccepted ? 'Accepted' : 'Rejected'}
             </span>
          </div>
          <span className="text-[10px] font-bold opacity-30 font-mono uppercase tracking-widest text-black">Mission Result</span>
       </div>

       <div className="p-8 space-y-8">
          <div className="space-y-1">
             <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-black">Status</p>
             <p className={cn(
               "text-4xl font-semibold tracking-tight",
               isAccepted ? "text-emerald-600" : "text-red-600"
             )}>{state.result}</p>
             {state.message && <p className="text-sm font-medium text-black/60 italic leading-relaxed">{state.message}</p>}
          </div>

          {state.output && (
            <div className="space-y-3 pt-6 border-t border-black/5">
               <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-black">System Output</p>
               <div className="bg-black/5 p-6 rounded-xl text-black/80 text-sm font-mono leading-relaxed border border-black/5 shadow-inner">
                  {state.output}
               </div>
            </div>
          )}

          {state.hint && (
            <div className="space-y-3 pt-6 border-t border-black/5">
               <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-black">Command Hint</p>
               <div className="bg-red-500/5 p-5 rounded-xl border border-red-500/10">
                  <p className="text-sm text-red-700 font-semibold italic">
                    {state.hint}
                  </p>
               </div>
            </div>
          )}
       </div>
    </Card>
  );
}
