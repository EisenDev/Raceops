'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, X, Clock, ArrowRight, User as UserIcon } from 'lucide-react';
import { approveEditRequest, declineEditRequest } from '@/lib/actions/edit-requests';
import { formatSeconds } from '@/lib/utils';

interface ScoreValue {
  totalPoints: number;
  scoringMode: string;
  memberScores: { memberId: string; points: number }[];
}

interface RequestCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
  isAdmin: boolean;
}

export function RequestCard({ request, isAdmin }: RequestCardProps) {
  const [adminRemarks, setAdminRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    const result = await approveEditRequest(request.id, adminRemarks);
    if (result.error) alert(result.error);
    setIsProcessing(false);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    const result = await declineEditRequest(request.id, adminRemarks);
    if (result.error) alert(result.error);
    setIsProcessing(false);
  };

  const requestedValue = request.requestedValue as unknown as ScoreValue;
  const currentValue = request.currentValue as unknown as ScoreValue;

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#1A1A1A]">{request.team.name}</span>
              <span className="text-[#999999]">/</span>
              <Badge variant="muted" className="text-[10px]">{request.module}</Badge>
            </div>
            <Badge variant={
              request.status === 'PENDING' ? 'warning' : 
              request.status === 'APPROVED' ? 'success' : 'error'
            }>
              {request.status === 'PENDING' && <Clock size={10} className="mr-1" />}
              {request.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F9F9F9] p-4 rounded-xl border border-[#1A1A1A]/5 space-y-2">
              <p className="text-[10px] font-semibold text-[#999999]">Current results</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#666666]">{formatSeconds(currentValue.totalPoints)}</span>
                <span className="text-[10px] font-semibold text-[#999999]">TIME</span>
              </div>
              <p className="text-[10px] font-semibold text-[#999999]">{currentValue.scoringMode.replace('_', ' ')}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-[#1A1A1A] shadow-md space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <ArrowRight size={48} className="-rotate-45" />
              </div>
              <p className="text-[10px] font-semibold text-[#1A1A1A]">Requested results</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#1A1A1A]">{formatSeconds(requestedValue.totalPoints)}</span>
                <span className="text-[10px] font-semibold text-[#1A1A1A]">TIME</span>
              </div>
              <p className="text-[10px] font-semibold text-[#666666]">{requestedValue.scoringMode.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-[#999999]">Reason for correction</p>
            <p className="text-sm text-[#1A1A1A] font-medium leading-relaxed italic">&quot;{request.reason}&quot;</p>
          </div>

          {request.adminRemarks && (
            <div className="space-y-1 pt-2 border-t border-[#1A1A1A]/5">
              <p className="text-[10px] font-semibold text-[#999999]">Admin remarks</p>
              <p className="text-sm text-[#666666] leading-relaxed">{request.adminRemarks}</p>
            </div>
          )}
        </div>

        {isAdmin && request.status === 'PENDING' && (
          <div className="bg-[#F9F9F9]/50 lg:border-l border-[#1A1A1A]/5 p-6 flex flex-col justify-center gap-4 lg:w-72">
            <p className="text-[10px] font-semibold text-center text-[#999999]">Admin actions</p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-[#1A1A1A]">Internal remarks</label>
              <textarea 
                className="w-full rounded-lg border border-[#1A1A1A]/10 bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all"
                placeholder="Optional notes..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleApprove} disabled={isProcessing} className="w-full font-semibold text-xs h-10">
                <Check size={14} className="mr-2" />
                Approve & Apply
              </Button>
              <Button onClick={handleDecline} disabled={isProcessing} variant="outline" className="w-full font-semibold text-xs h-10 text-red-600 hover:bg-red-50 hover:border-red-100">
                <X size={14} className="mr-2" />
                Decline Request
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1A1A1A] px-6 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <UserIcon size={12} className="text-white/40" />
            <p className="text-[10px] font-semibold text-white/60">
              Requested by {request.requestedBy.name}
            </p>
         </div>
         <p className="text-[10px] font-semibold text-white/40">
            {new Date(request.createdAt).toLocaleString()}
         </p>
      </div>
    </Card>
  );
}
