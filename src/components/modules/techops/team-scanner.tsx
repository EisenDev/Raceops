'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { scanTechOpsCard } from '@/lib/actions/techops';
import { ChevronDown, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamScannerProps {
  team: {
    id: string;
    name: string;
    techOpsScore: number;
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
  const [state, action, isPending] = useActionState(scanTechOpsCard, undefined);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormKey(prev => prev + 1);
    }
  }, [state?.success]);

  const TECH_OPS_CAP = 200;

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <div 
        className={cn(
          "flex items-center justify-between p-5 bg-white cursor-pointer hover:bg-[#F9F9F9] transition-colors",
          isExpanded && "border-b border-[#1A1A1A]/5"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className="font-bold uppercase tracking-tight">{team.name}</span>
          <Badge variant={team.techOpsScore >= TECH_OPS_CAP ? 'success' : 'muted'} className="text-[8px]">
             {team.techOpsScore >= TECH_OPS_CAP ? 'CAPPED' : `${team.scans.length} Cards`}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-xl font-black",
            team.techOpsScore >= TECH_OPS_CAP ? "text-[#2E7D32]" : "text-[#1A1A1A]"
          )}>
            {team.techOpsScore} / {TECH_OPS_CAP}
          </span>
          <ChevronDown size={18} className={cn("text-[#999999] transition-transform", isExpanded && "rotate-180")} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 bg-[#F9F9F9]/30 space-y-6">
          <form action={action} key={formKey} className="space-y-4">
            <input type="hidden" name="teamId" value={team.id} />
            
            {state?.error && (
              <StatusMessage variant="error" title="Error" message={state.error} />
            )}

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input 
                  name="code" 
                  placeholder="Enter Code (e.g. UI-K7P2)" 
                  className="pl-10 h-12 uppercase font-black tracking-widest placeholder:tracking-normal placeholder:font-medium"
                  required
                  autoFocus
                />
                <QrCode size={18} className="absolute left-3 top-3.5 text-[#999999]" />
              </div>
              <Button type="submit" disabled={isPending} className="font-bold text-xs px-8">
                {isPending ? 'Validating...' : 'Scan / Add'}
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Collection History</p>
            {team.scans.length === 0 ? (
              <div className="py-8 text-center bg-white rounded-xl border border-dashed border-[#1A1A1A]/5">
                 <p className="text-xs font-bold text-[#999999] uppercase tracking-widest">No cards scanned yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {team.scans.map((scan) => (
                  <div 
                    key={scan.id} 
                    className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#1A1A1A]/5 shadow-sm"
                  >
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-[#1A1A1A] leading-none mb-1">{scan.card.code}</span>
                       <span className="text-[8px] font-bold text-[#666666] uppercase tracking-tighter truncate max-w-[80px]">{scan.card.label}</span>
                    </div>
                    <Badge 
                      variant={scan.pointsApplied > 0 ? 'success' : scan.pointsApplied < 0 ? 'error' : 'muted'}
                      className="text-[9px] h-5"
                    >
                      {scan.pointsApplied > 0 ? `+${scan.pointsApplied}` : scan.pointsApplied}
                    </Badge>
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
