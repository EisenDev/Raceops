'use client';

import { useState, useActionState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { createEditRequest } from '@/lib/actions/edit-requests';
import { X, History, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestEditModalProps {
  game: { id: string; name: string; maxPoints: number };
  team: { id: string; name: string; members: { id: string; name: string }[] };
  existingScore: { id: string; totalPoints: number; scoringMode: string; memberScores: { teamMemberId: string; points: number }[] };
}

export function RequestEditModal({ game, team, existingScore }: RequestEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = () => {
    setModalKey(prev => prev + 1);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" className="font-bold text-xs" onClick={handleOpen}>
        <History size={14} className="mr-2" />
        Request Edit
      </Button>
    );
  }

  return (
    <RequestEditModalContent 
      key={modalKey}
      game={game}
      team={team}
      existingScore={existingScore}
      onClose={() => setIsOpen(false)}
    />
  );
}

function RequestEditModalContent({ game, team, existingScore, onClose }: RequestEditModalProps & { onClose: () => void }) {
  const [scoringMode, setScoringMode] = useState<'TEAM_TOTAL' | 'MEMBER_BREAKDOWN'>(
    (existingScore.scoringMode as 'TEAM_TOTAL' | 'MEMBER_BREAKDOWN') || 'TEAM_TOTAL'
  );
  
  const [memberPoints, setMemberPoints] = useState<Record<string, number>>(() => {
    const points: Record<string, number> = {};
    existingScore.memberScores.forEach(ms => {
      points[ms.teamMemberId] = ms.points;
    });
    return points;
  });

  const [teamTotal, setTeamTotal] = useState(existingScore.totalPoints);
  const [reason, setReason] = useState('');

  const currentTotal = useMemo(() => {
    if (scoringMode === 'TEAM_TOTAL') return teamTotal;
    return Object.values(memberPoints).reduce((sum, p) => sum + p, 0);
  }, [scoringMode, memberPoints, teamTotal]);

  const [state, action, isPending] = useActionState(createEditRequest, undefined);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const handleMemberPointsChange = (memberId: string, value: string) => {
    const points = parseInt(value) || 0;
    setMemberPoints(prev => ({ ...prev, [memberId]: Math.max(0, points) }));
  };

  const requestedValue = {
    scoringMode,
    totalPoints: currentTotal,
    memberScores: scoringMode === 'MEMBER_BREAKDOWN' 
      ? team.members.map(m => ({ memberId: m.id, points: memberPoints[m.id] || 0 }))
      : []
  };

  const currentValue = {
    scoringMode: existingScore.scoringMode,
    totalPoints: existingScore.totalPoints,
    memberScores: existingScore.memberScores.map(ms => ({ memberId: ms.teamMemberId, points: ms.points }))
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <Card className="w-full max-w-lg shadow-2xl relative my-8 text-left">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Request Score Correction</CardTitle>
          <p className="text-sm text-[#666666]">Requesting change for <strong>{team.name}</strong> in <strong>{game.name}</strong></p>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-6">
            <input type="hidden" name="module" value="GAME_SCORE" />
            <input type="hidden" name="referenceId" value={existingScore.id} />
            <input type="hidden" name="teamId" value={team.id} />
            <input type="hidden" name="currentValue" value={JSON.stringify(currentValue)} />
            <input type="hidden" name="requestedValue" value={JSON.stringify(requestedValue)} />

            {state?.error && (
              <StatusMessage variant="error" title="Error" message={state.error} />
            )}

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3 items-start">
               <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Your request will be sent to the Admin/CEO for review. The leaderboard will only update once approved.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Requested Method</p>
                <div className="flex bg-white rounded-lg p-1 border border-[#1A1A1A]/5">
                  <button
                    type="button"
                    onClick={() => setScoringMode('TEAM_TOTAL')}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                      scoringMode === 'TEAM_TOTAL' ? "bg-[#1A1A1A] text-white shadow-md" : "text-[#666666] hover:bg-[#F9F9F9]"
                    )}
                  >
                    Team Total
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoringMode('MEMBER_BREAKDOWN')}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                      scoringMode === 'MEMBER_BREAKDOWN' ? "bg-[#1A1A1A] text-white shadow-md" : "text-[#666666] hover:bg-[#F9F9F9]"
                    )}
                  >
                    Member Breakdown
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Requested Total</p>
                <p className={cn(
                  "text-2xl font-black",
                  currentTotal > game.maxPoints ? "text-red-500" : ""
                )}>{currentTotal} pts</p>
              </div>
            </div>

            {scoringMode === 'TEAM_TOTAL' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">New Team Total</label>
                <Input 
                  type="number" 
                  value={teamTotal}
                  onChange={(e) => setTeamTotal(parseInt(e.target.value) || 0)}
                  className="h-14 text-2xl font-black text-center"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-[#1A1A1A]/5">
                    <span className="text-sm font-bold truncate">{member.name}</span>
                    <Input 
                      type="number" 
                      value={memberPoints[member.id] || 0}
                      onChange={(e) => handleMemberPointsChange(member.id, e.target.value)}
                      className="w-16 text-center h-8 font-black text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Reason for Correction</label>
              <textarea 
                name="reason" 
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex w-full rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-3 text-sm transition-colors placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20"
                placeholder="Explain why the score needs to be changed..."
                required
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#1A1A1A]/5">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1 font-bold text-xs" 
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 font-bold text-xs" 
                disabled={isPending || currentTotal > game.maxPoints || reason.length < 5}
              >
                {isPending ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
