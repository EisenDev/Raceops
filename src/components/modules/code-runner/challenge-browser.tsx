'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Eye, AlertCircle, Copy, Check, Lock, Database } from 'lucide-react';
import { Difficulty, CodeChallenge } from '@prisma/client';
import { getCodeChallengeDetails } from '@/lib/actions/code-runner';

interface CodeInventoryProps {
  challenges: Pick<CodeChallenge, 'id' | 'languageTrack' | 'difficulty' | 'title' | 'status'>[];
  isAdmin: boolean;
}

function CopyableBlock({ title, code, variant = 'default' }: { title: string, code: string, variant?: 'default' | 'success' | 'danger' | 'info' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const variantStyles = {
    default: 'text-[#1A1A1A]',
    success: 'text-emerald-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
  };

  const borderStyles = {
    default: 'border-[#1A1A1A]/10',
    success: 'border-emerald-500/30',
    danger: 'border-red-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
         <p className={cn("text-[10px] font-semibold", variantStyles[variant])}>{title}</p>
         <button 
           onClick={handleCopy}
           className="px-2 py-1 hover:bg-[#1A1A1A]/5 rounded transition-all flex items-center gap-1.5 text-[10px] font-semibold text-[#999999]"
         >
           {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
           {copied ? 'Copied' : 'Copy'}
         </button>
      </div>
      <div className={cn(
        "relative rounded-2xl border-2 overflow-hidden",
        borderStyles[variant]
      )}>
        <pre className="p-6 bg-[#1A1A1A] text-white/90 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar">
          {code}
        </pre>
      </div>
    </div>
  );
}

export function ChallengeBrowser({ challenges, isAdmin }: CodeInventoryProps) {
  const [viewingChallenge, setViewingChallenge] = useState<CodeInventoryProps['challenges'][0] | null>(null);
  const [details, setDetails] = useState<CodeChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = async (challenge: CodeInventoryProps['challenges'][0]) => {
    if (!isAdmin) return;
    setViewingChallenge(challenge);
    setIsLoading(true);
    const data = await getCodeChallengeDetails(challenge.id);
    setDetails(data);
    setIsLoading(false);
  };

  if (!isAdmin) {
    return (
      <Card className="p-10 text-center bg-[#F9F9F9]/50 border-dashed border-2 border-[#1A1A1A]/5 rounded-3xl">
        <Lock size={32} className="mx-auto text-[#CCCCCC] mb-4" />
        <p className="text-xs font-semibold text-[#999999] leading-relaxed">
          Challenge details and answer keys are restricted to Admin roles only.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-semibold text-muted-foreground opacity-50">Code inventory</h3>
        <Badge variant="muted" className="text-[10px]">
          {challenges.length} Challenges
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {challenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            onClick={() => handleViewDetails(challenge)}
            className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <Badge variant="muted" className="text-[10px]">{challenge.languageTrack}</Badge>
                   <p className="text-lg font-semibold text-white/90">{challenge.title}</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground opacity-40">Difficulty: {challenge.difficulty.toLowerCase()}</p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-white transition-all">
                <Eye size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Admin Answer Key Modal */}
      {viewingChallenge && isAdmin && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md" onClick={() => setViewingChallenge(null)}>
          <Card variant="ivory" className="w-full max-w-5xl max-h-[90vh] shadow-2xl border-none overflow-hidden flex flex-col rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-black/5 flex justify-between items-center shrink-0">
               <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="muted" className="text-[10px]">{viewingChallenge.languageTrack}</Badge>
                    <span className="text-2xl font-semibold tracking-tight">{viewingChallenge.title}</span>
                  </div>
                  <p className="text-xs font-medium opacity-40">Official answer key • Restricted access</p>
               </div>
               <Button 
                 variant="secondary" 
                 className="h-10 px-4 text-xs" 
                 onClick={() => setViewingChallenge(null)}
               >
                 Close
               </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
               {isLoading ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black/20" />
                    <p className="text-xs font-medium opacity-40">Loading records...</p>
                 </div>
               ) : details ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div className="space-y-3">
                          <p className="text-xs font-semibold opacity-30 px-1">Challenge prompt</p>
                          <div className="text-sm leading-relaxed p-6 bg-black/5 rounded-2xl font-medium">
                             {details.prompt}
                          </div>
                       </div>

                       <CopyableBlock title="Expected output" code={details.expectedOutput || 'No output expected'} variant="info" />

                       <div className="p-5 bg-black/5 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                             <p className="text-[10px] font-semibold opacity-30">Validation rule</p>
                             <p className="text-sm font-semibold">{details.validationRule}</p>
                          </div>
                          <Badge variant="muted" className="text-[10px]">{details.difficulty}</Badge>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <CopyableBlock title="Master answer (correct)" code={details.correctCode} variant="success" />
                       <CopyableBlock title="Buggy variant" code={details.buggyCode} variant="danger" />
                       
                       <div className="p-5 bg-amber-500/5 rounded-xl border border-amber-500/10 flex gap-3 items-start">
                          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                             <p className="text-xs font-semibold text-amber-900/60">Facilitator note</p>
                             <p className="text-xs text-amber-700 leading-relaxed font-medium italic">
                                &quot;{details.genericHint || 'Check structure and logic.'}&quot;
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <p className="text-center opacity-40 py-20 text-sm font-medium">Failed to load data.</p>
               )}
            </div>
          </Card>
        </div>
      )}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
