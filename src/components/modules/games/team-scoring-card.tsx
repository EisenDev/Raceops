'use client';

import { useState, useActionState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { ChevronDown, Save, Users, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveTeamScore, saveMemberBreakdownScore } from '@/lib/actions/game-scores';
import { EmptyState } from '@/components/ui/EmptyState';
import { RequestEditModal } from './request-edit-modal';
import { isScoresLocked } from '@/lib/actions/settings';
import { formatSeconds, secondsToTimeParts, timePartsToSeconds } from '@/lib/utils';

interface TeamScoringCardProps {
  game: { id: string; name: string; maxPoints: number };
  team: { id: string; name: string; color: string | null; assignedFacilitatorId?: string | null; members: { id: string; name: string }[] };
  existingScore?: { id: string; totalPoints: number; scoringMode: string; memberScores: { teamMemberId: string; points: number }[] };
  pendingRequest?: { id: string; status: string; reason: string };
  isAdmin: boolean;
  currentUser: { id: string; role: 'ADMIN' | 'FACILITATOR' };
}

export function TeamScoringCard({ game, team, existingScore, pendingRequest, isAdmin, currentUser }: TeamScoringCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const initialTeamTime = secondsToTimeParts(existingScore?.totalPoints ?? 0);
  const [teamHours, setTeamHours] = useState(initialTeamTime.hours);
  const [teamMinutes, setTeamMinutes] = useState(initialTeamTime.minutes);
  const [teamSeconds, setTeamSeconds] = useState(initialTeamTime.seconds);

  useEffect(() => {
    isScoresLocked().then(setIsLocked);
  }, []);

  const [scoringMode, setScoringMode] = useState<'TEAM_TOTAL' | 'MEMBER_BREAKDOWN'>(
    (existingScore?.scoringMode as 'TEAM_TOTAL' | 'MEMBER_BREAKDOWN') || 'TEAM_TOTAL'
  );
  
  const [memberPoints, setMemberPoints] = useState<Record<string, number>>(() => {
    const points: Record<string, number> = {};
    existingScore?.memberScores.forEach(ms => {
      points[ms.teamMemberId] = ms.points;
    });
    return points;
  });

  const currentTotal = useMemo(() => {
    if (scoringMode === 'TEAM_TOTAL') return timePartsToSeconds(teamHours, teamMinutes, teamSeconds) ?? 0;
    return Object.values(memberPoints).reduce((sum, p) => sum + p, 0);
  }, [scoringMode, memberPoints, teamHours, teamMinutes, teamSeconds]);

  const [teamState, teamAction, teamPending] = useActionState(saveTeamScore, undefined);
  const [isBreakdownPending, setIsBreakdownPending] = useState(false);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);

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

  const onSaveBreakdown = async () => {
    setIsBreakdownPending(true);
    setBreakdownError(null);
    
    const payload = team.members.map(m => ({
      memberId: m.id,
      points: memberPoints[m.id] || 0
    }));

    const result = await saveMemberBreakdownScore(game.id, team.id, payload);
    
    if (result?.error) {
      setBreakdownError(result.error);
    } else {
      setIsExpanded(false);
    }
    setIsBreakdownPending(false);
  };

  useEffect(() => {
    if (teamState?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExpanded(false);
    }
  }, [teamState?.success]);

  const isAssigned = isAdmin || team.assignedFacilitatorId === currentUser.id;
  const isLockedBySubmission = existingScore && !isAdmin;

  return (
    <Card className="overflow-hidden border-white/5 bg-white/[0.02] shadow-sm rounded-xl">
      <div 
        className={cn(
          "flex items-center justify-between p-6 cursor-pointer transition-all duration-200",
          isExpanded ? "bg-white/[0.05] border-b border-white/5" : "hover:bg-white/[0.03]"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-1 h-6 rounded-full" 
            style={{ backgroundColor: team.color || '#C5A059' }} 
          />
          <div className="flex flex-col">
             <span className="text-lg font-medium text-white/90">{team.name}</span>
             <div className="flex items-center gap-2">
                {existingScore && (
                  <Badge variant="success" className="text-[10px] px-1.5 py-0">Completed</Badge>
                )}
                {pendingRequest && (
                  <Badge variant="warning" className="text-[10px] px-1.5 py-0">Review pending</Badge>
                )}
             </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className={cn(
              "text-xl font-semibold tabular-nums tracking-tight transition-colors",
              isExpanded ? "text-accent" : "text-white/70"
            )}>
              {formatSeconds(currentTotal)}
            </p>
          </div>
          <ChevronDown size={18} className={cn("text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-8 bg-black/20 space-y-8 animate-in slide-in-from-top-2 duration-300">
          {isLocked && (
            <StatusMessage 
              variant="error"
              title="Scores locked"
              message="Final results are now official. Changes require administrator access."
            />
          )}

          {!isAssigned && !isLocked && (
            <StatusMessage 
              variant="info"
              title="Read only"
              message="You are not assigned to this team. Only the assigned staff can record scores."
            />
          )}

          {isAssigned && isLockedBySubmission && !isLocked ? (
            <div className="space-y-6">
              <StatusMessage 
                variant="warning"
                title="Result recorded"
                message="This score has been saved. Please request an edit if a correction is needed."
              />
              <div className="flex justify-end pt-4 border-t border-white/5">
                <RequestEditModal 
                  game={game} 
                  team={team} 
                  existingScore={existingScore as { id: string; totalPoints: number; scoringMode: string; memberScores: { teamMemberId: string; points: number }[] }} 
                  pendingRequest={pendingRequest}
                />
              </div>
            </div>
          ) : isAssigned && !isLocked ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground opacity-60">Scoring method</p>
                  <div className="flex bg-white/[0.03] rounded-lg p-1 border border-white/5">
                    <button
                      onClick={() => setScoringMode('TEAM_TOTAL')}
                     className={cn(
                        "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                        scoringMode === 'TEAM_TOTAL' ? "bg-accent text-black" : "text-muted-foreground hover:text-white"
                      )}
                    >
                      Team total
                    </button>
                    <button
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
                  <p className="text-xs font-medium text-muted-foreground opacity-50 mb-0.5">Total time</p>
                  <p className="text-2xl font-semibold tabular-nums tracking-tight text-white">{formatSeconds(currentTotal)}</p>
                </div>
              </div>

              {scoringMode === 'TEAM_TOTAL' ? (
                <form action={teamAction} className="space-y-6">
                  <input type="hidden" name="gameId" value={game.id} />
                  <input type="hidden" name="teamId" value={team.id} />
                  
                  {teamState?.error && (
                    <StatusMessage variant="error" title="Input error" message={teamState.error} />
                  )}

                  <div className="space-y-3">
                    <label className="text-xs font-medium text-muted-foreground">Enter team time (HH:MM:SS)</label>
                    <input type="hidden" name="totalPoints" value={`${teamHours || '00'}:${teamMinutes || '00'}:${teamSeconds || '00'}`} />
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
                  
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <Button type="submit" disabled={teamPending || isLocked} className="h-12 px-8 text-xs">
                      <Save size={16} className="mr-2" />
                      Save record
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {breakdownError && (
                    <StatusMessage variant="error" title="Input error" message={breakdownError} />
                  )}

                  {team.members.length === 0 ? (
                    <EmptyState 
                      title="No members"
                      description="Please register members for this team first."
                      className="py-10 bg-white/[0.01]"
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {team.members.map((member) => (
                        <Card variant="ivory" key={member.id} className="p-5 space-y-4 border-none shadow-sm">
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
                              className="text-center h-10 bg-white/40 border-black/5 text-base font-medium rounded-lg"
                            />
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={secondsToTimeParts(memberPoints[member.id] ?? 0).minutes}
                              placeholder="00"
                              onChange={(e) => handleMemberPointsChange(member.id, 'minutes', e.target.value)}
                              className="text-center h-10 bg-white/40 border-black/5 text-base font-medium rounded-lg"
                            />
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={secondsToTimeParts(memberPoints[member.id] ?? 0).seconds}
                              placeholder="00"
                              onChange={(e) => handleMemberPointsChange(member.id, 'seconds', e.target.value)}
                              className="text-center h-10 bg-white/40 border-black/5 text-base font-medium rounded-lg"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <Button 
                      onClick={onSaveBreakdown} 
                      disabled={isBreakdownPending || team.members.length === 0 || isLocked} 
                      className="h-12 px-8 text-xs"
                    >
                      <Save size={16} className="mr-2" />
                      Save breakdown
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
