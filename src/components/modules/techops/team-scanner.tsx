'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { scanTechOpsCard } from '@/lib/actions/techops';
import { ChevronDown, QrCode, Cpu, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isScoresLocked } from '@/lib/actions/settings';

interface TeamScannerProps {
  team: {
    id: string;
    name: string;
    techOpsScore: number;
    color: string | null;
    scans: {
      id: string;
      pointsApplied: number;
      card: {
        code: string;
        label: string;
        type: string;
      }
    }[];
  };
}

export function TeamScanner({ team }: TeamScannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [state, action, isPending] = useActionState(scanTechOpsCard, undefined);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    isScoresLocked().then(setIsLocked);
  }, []);

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormKey(prev => prev + 1);
    }
  }, [state?.success]);

  const TECH_OPS_CAP = 200;

  return (
    <Card className="overflow-hidden border-white/5 bg-white/[0.02] shadow-premium rounded-[24px]">
      <div 
        className={cn(
          "flex items-center justify-between p-6 cursor-pointer transition-all duration-300",
          isExpanded ? "bg-white/[0.05] border-b border-white/5" : "hover:bg-white/[0.03]"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-5">
          <div 
            className="w-1.5 h-8 rounded-full shadow-lg" 
            style={{ 
              backgroundColor: team.color || '#C5A059',
              boxShadow: isExpanded ? `0 0 15px ${team.color || '#C5A059'}40` : 'none'
            }} 
          />
          <div className="space-y-0.5">
             <span className="text-lg font-black uppercase tracking-tight text-white/90">{team.name}</span>
             <Badge variant={team.techOpsScore >= TECH_OPS_CAP ? 'success' : 'muted'} className="text-[7px] px-1.5 py-0">
                {team.techOpsScore >= TECH_OPS_CAP ? 'STATION CAPPED' : `${team.scans.length} PLUGS`}
             </Badge>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className={cn(
              "text-2xl font-black tracking-tighter tabular-nums transition-colors",
              team.techOpsScore >= TECH_OPS_CAP ? "text-emerald-400" : (isExpanded ? "text-accent" : "text-white/80")
            )}>
              {team.techOpsScore} <span className="text-sm opacity-30 text-white">/ {TECH_OPS_CAP}</span>
            </p>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300",
            isExpanded ? "bg-accent border-accent text-black rotate-180" : "text-muted-foreground"
          )}>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-8 bg-black/40 space-y-8 animate-in slide-in-from-top-4 duration-500">
          {isLocked && (
            <StatusMessage 
              variant="error"
              title="System Locked"
              message="Final telemetry is synchronized. Field scanning is disabled."
            />
          )}

          <form action={action} key={formKey} className="space-y-4">
            <input type="hidden" name="teamId" value={team.id} />
            
            {state?.error && (
              <StatusMessage variant="error" title="Auth Failure" message={state.error} className="bg-red-500/5 border-red-500/10 text-red-400" />
            )}

            <div className="flex gap-4">
              <div className="relative flex-1 group">
                <Input 
                  name="code" 
                  placeholder="PAYLOAD ID..." 
                  className="pl-12 h-14 uppercase font-black tracking-widest bg-black border-white/10 focus:border-accent/40 rounded-xl"
                  required
                  disabled={isLocked}
                />
                <QrCode size={18} className="absolute left-4 top-4.5 text-muted-foreground/30 group-focus-within:text-accent transition-colors" />
              </div>
              <Button type="submit" disabled={isPending || isLocked} className="h-14 px-8 gap-3">
                {isPending ? 'Syncing...' : 'Inject Payload'}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
               <History size={14} className="text-muted-foreground" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieval Logs</p>
            </div>
            
            {team.scans.length === 0 ? (
              <div className="py-10 text-center bg-black/40 rounded-[20px] border border-dashed border-white/10">
                 <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">No payloads secured</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {team.scans.map((scan) => (
                  <div 
                    key={scan.id} 
                    className="flex flex-col p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[11px] font-mono font-bold text-white/80 group-hover:text-accent transition-colors">{scan.card.code}</span>
                       <Badge 
                         variant={scan.pointsApplied > 0 ? 'success' : scan.pointsApplied < 0 ? 'error' : 'muted'}
                         className="text-[8px] h-4 px-1 py-0"
                       >
                         {scan.pointsApplied > 0 ? `+${scan.pointsApplied}` : scan.pointsApplied}
                       </Badge>
                    </div>
                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter truncate">{scan.card.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
