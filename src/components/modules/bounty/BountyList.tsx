'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, Shield, Calendar, Trophy } from 'lucide-react';
import { voidBounty } from '@/lib/actions/bounty';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface BountyListProps {
  bounties: {
    id: string;
    team: { name: string };
    status: string;
    code: string;
    points: number;
    createdAt: Date;
    claimedByTeam: { name: string } | null;
  }[];
  isAdmin: boolean;
}

export function BountyList({ bounties, isAdmin }: BountyListProps) {
  const [voidId, setVoidId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleVoid = async () => {
    if (!voidId) return;
    setIsPending(true);
    const result = await voidBounty(voidId);
    if (result.error) alert(result.error);
    setVoidId(null);
    setIsPending(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#999999] flex items-center gap-2">
          <Shield size={14} />
          Active Bounties ({bounties.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bounties.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#F9F9F9]/50 rounded-2xl border border-dashed border-[#1A1A1A]/5">
             <p className="text-xs font-bold text-[#999999] uppercase tracking-widest">No bounties generated yet</p>
          </div>
        ) : (
          bounties.map((bounty) => (
            <Card key={bounty.id} className="border-none shadow-sm group hover:border-[#1A1A1A]/5 transition-all">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Target Team</p>
                      <h4 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A]">{bounty.team.name}</h4>
                   </div>
                   <Badge variant={
                     bounty.status === 'ACTIVE' ? 'default' : 
                     bounty.status === 'CLAIMED' ? 'success' : 'error'
                   } className="text-[8px]">
                     {bounty.status}
                   </Badge>
                </div>

                <div className="bg-[#F9F9F9] p-3 rounded-lg flex items-center justify-between">
                   <div className="space-y-0.5">
                      <p className="text-[8px] font-black uppercase text-[#999999]">Access Code</p>
                      <p className="text-sm font-black tracking-[0.15em]">{bounty.code}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black uppercase text-[#999999]">Value</p>
                      <p className="text-sm font-black text-[#1A1A1A]">{bounty.points} PTS</p>
                   </div>
                </div>

                <div className="pt-3 border-t border-[#1A1A1A]/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-[#999999]" />
                      <span className="text-[10px] font-bold text-[#999999]">{new Date(bounty.createdAt).toLocaleDateString()}</span>
                   </div>
                   
                   {bounty.status === 'CLAIMED' && bounty.claimedByTeam && (
                     <div className="flex items-center gap-2">
                        <Trophy size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-black uppercase text-[#1A1A1A]">{bounty.claimedByTeam.name}</span>
                     </div>
                   )}

                   {isAdmin && bounty.status === 'ACTIVE' && (
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-8 w-8 p-0 text-[#999999] hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                       onClick={() => setVoidId(bounty.id)}
                     >
                       <Trash2 size={14} />
                     </Button>
                   )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ConfirmModal 
        isOpen={!!voidId}
        onClose={() => setVoidId(null)}
        onConfirm={handleVoid}
        title="Void Bounty"
        description="Are you sure you want to void this bounty? It will no longer be claimable."
        confirmText="Void Bounty"
        isPending={isPending}
      />
    </div>
  );
}
