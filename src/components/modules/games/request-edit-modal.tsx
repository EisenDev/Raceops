'use client';

import { useState, useActionState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { createEditRequest } from '@/lib/actions/edit-requests';
import { X, History, Info, AlertTriangle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSeconds, secondsToTimeParts, timePartsToSeconds } from '@/lib/utils';

interface RequestEditModalProps {
  game: { id: string; name: string; maxPoints: number };
  team: { id: string; name: string; members: { id: string; name: string }[] };
  existingScore: { id: string; totalPoints: number; scoringMode: string; memberScores: { teamMemberId: string; points: number }[] };
  pendingRequest?: { id: string; status: string; reason: string };
}

export function RequestEditModal({ game, team, existingScore, pendingRequest }: RequestEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = () => {
    setModalKey(prev => prev + 1);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" className="font-semibold text-xs" onClick={handleOpen}>
        <History size={14} className="mr-2" />
        {pendingRequest ? 'Already Requested' : 'Request Edit'}
      </Button>
    );
  }

  return (
    <RequestEditModalContent 
      key={modalKey}
      game={game}
      team={team}
      existingScore={existingScore}
      pendingRequest={pendingRequest}
      onClose={() => setIsOpen(false)}
    />
  );
}

function RequestEditModalContent({ game, team, existingScore, pendingRequest, onClose }: RequestEditModalProps & { onClose: () => void }) {
  const initialTeamTime = secondsToTimeParts(existingScore.totalPoints);
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

  const [teamHours, setTeamHours] = useState(initialTeamTime.hours);
  const [teamMinutes, setTeamMinutes] = useState(initialTeamTime.minutes);
  const [teamSeconds, setTeamSeconds] = useState(initialTeamTime.seconds);
  const [reason, setReason] = useState('');

  const currentTotal = useMemo(() => {
    if (scoringMode === 'TEAM_TOTAL') return timePartsToSeconds(teamHours, teamMinutes, teamSeconds) ?? 0;
    return Object.values(memberPoints).reduce((sum, p) => sum + p, 0);
  }, [scoringMode, memberPoints, teamHours, teamMinutes, teamSeconds]);

  const [state, action, isPending] = useActionState(createEditRequest, undefined);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const handleTimePartChange = (
    value: string,
    setter: (next: string) => void,
    maxLength: number,
  ) => {
    if (!/^\d*$/.test(value)) return;
    setter(value.slice(0, maxLength));
  };

  const handleMemberPointsChange = (memberId: string, part: 'hours' | 'minutes' | 'seconds', value: string) => {
    const existing = secondsToTimeParts(memberPoints[memberId] ?? 0);
    const nextHours = part === 'hours' ? value : existing.hours;
    const nextMinutes = part === 'minutes' ? value : existing.minutes;
    const nextSeconds = part === 'seconds' ? value : existing.seconds;

    if (!/^\d*$/.test(value)) return;
    if ((part === 'minutes' || part === 'seconds') && value.length > 2) return;
    if (part === 'hours' && value.length > 3) return;

    const points = timePartsToSeconds(nextHours, nextMinutes, nextSeconds);
    if (points === null) return;

    setMemberPoints(prev => ({ ...prev, [memberId]: points }));
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
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Request score correction</CardTitle>
          <p className="text-sm text-muted-foreground opacity-60">Team: {team.name} • Game: {game.name}</p>
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

            {pendingRequest ? (
               <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                     <p className="text-xs font-semibold text-amber-500">Duplicate request</p>
                     <p className="text-xs text-amber-200/60 leading-relaxed font-medium">
                        You have already sent an edit request for this entry. Sending another will create a new entry for review.
                     </p>
                  </div>
               </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 items-start">
                 <Info size={16} className="text-accent shrink-0 mt-0.5" />
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Your request will be reviewed by an administrator. The standings will only update once approved.
                 </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground opacity-60">Correction method</p>
                <div className="flex bg-white/[0.03] rounded-lg p-1 border border-white/5">
                  <button
                    type="button"
                    onClick={() => setScoringMode('TEAM_TOTAL')}
                    className={cn(
                      "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                      scoringMode === 'TEAM_TOTAL' ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Team total
                  </button>
                  <button
                    type="button"
                    onClick={() => setScoringMode('MEMBER_BREAKDOWN')}
                    className={cn(
                      "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                      scoringMode === 'MEMBER_BREAKDOWN' ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Member breakdown
                  </button>
                </div>
              </div>
              <div className="text-right px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-medium text-muted-foreground opacity-50 mb-0.5">New total</p>
                <p className="text-2xl font-semibold tabular-nums tracking-tight text-white">{formatSeconds(currentTotal)}</p>
              </div>
            </div>

            {scoringMode === 'TEAM_TOTAL' ? (
              <div className="space-y-2">
                <label className="text-xs font-medium text-white">New team time (HH:MM:SS)</label>
                <div className="grid grid-cols-3 gap-4 max-w-sm">
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={teamHours}
                      onChange={(e) => handleTimePartChange(e.target.value, setTeamHours, 3)}
                      placeholder="00"
                      className="h-14 text-2xl font-medium text-center bg-black border-white/10 focus:border-accent/40 rounded-xl"
                      required
                    />
                    <p className="text-center text-[10px] text-muted-foreground/40 font-medium">Hours</p>
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={teamMinutes}
                      onChange={(e) => handleTimePartChange(e.target.value, setTeamMinutes, 2)}
                      placeholder="00"
                      className="h-14 text-2xl font-medium text-center bg-black border-white/10 focus:border-accent/40 rounded-xl"
                      required
                    />
                    <p className="text-center text-[10px] text-muted-foreground/40 font-medium">Minutes</p>
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={teamSeconds}
                      onChange={(e) => handleTimePartChange(e.target.value, setTeamSeconds, 2)}
                      placeholder="00"
                      className="h-14 text-2xl font-medium text-center bg-black border-white/10 focus:border-accent/40 rounded-xl"
                      required
                    />
                    <p className="text-center text-[10px] text-muted-foreground/40 font-medium">Seconds</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-48 overflow-y-auto pr-2">
                {team.members.map((member) => (
                  <Card variant="ivory" key={member.id} className="p-4 space-y-3 border-none shadow-sm">
                    <div className="flex items-center gap-2">
                       <User size={14} className="opacity-40" />
                       <span className="text-sm font-semibold truncate">{member.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={secondsToTimeParts(memberPoints[member.id] ?? 0).hours}
                        placeholder="00"
                        onChange={(e) => handleMemberPointsChange(member.id, 'hours', e.target.value)}
                        className="text-center h-8 font-medium text-xs bg-white/40 border-black/5"
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={secondsToTimeParts(memberPoints[member.id] ?? 0).minutes}
                        placeholder="00"
                        onChange={(e) => handleMemberPointsChange(member.id, 'minutes', e.target.value)}
                        className="text-center h-8 font-medium text-xs bg-white/40 border-black/5"
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={secondsToTimeParts(memberPoints[member.id] ?? 0).seconds}
                        placeholder="00"
                        onChange={(e) => handleMemberPointsChange(member.id, 'seconds', e.target.value)}
                        className="text-center h-8 font-medium text-xs bg-white/40 border-black/5"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Reason for correction</label>
              <textarea 
                name="reason" 
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex w-full rounded-lg border border-white/10 bg-white px-4 py-3 text-sm transition-colors text-black placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent"
                placeholder="Briefly explain the reason for this change..."
                required
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/5">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1 text-xs" 
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 text-xs" 
                disabled={isPending || reason.length < 5}
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
