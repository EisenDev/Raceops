'use client';

import { useState, useActionState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { ChevronDown, Save, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveTeamScore, saveMemberBreakdownScore } from '@/lib/actions/game-scores';
import { EmptyState } from '@/components/ui/EmptyState';
import { RequestEditModal } from './request-edit-modal';

interface TeamScoringCardProps {
  game: { id: string; name: string; maxPoints: number };
  team: { id: string; name: string; color: string | null; members: { id: string; name: string }[] };
  existingScore?: { id: string; totalPoints: number; scoringMode: 'TEAM_TOTAL' | 'MEMBER_BREAKDOWN'; memberScores: { teamMemberId: string; points: number }[] };
  isAdmin: boolean;
}

export function TeamScoringCard({ game, team, existingScore, isAdmin }: TeamScoringCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scoringMode, setScoringMode] = useState<'TEAM_TOTAL' | 'MEMBER_BREAKDOWN'>(
    (existingScore?.scoringMode as 'TEAM_TOTAL' | 'MEMBER_BREAKDOWN') || 'TEAM_TOTAL'
  );
  
  // Local state for member points to allow live calculation
  const [memberPoints, setMemberPoints] = useState<Record<string, number>>(() => {
    const points: Record<string, number> = {};
    existingScore?.memberScores.forEach(ms => {
      points[ms.teamMemberId] = ms.points;
    });
    return points;
  });

  const currentTotal = useMemo(() => {
    if (scoringMode === 'TEAM_TOTAL') return existingScore?.totalPoints || 0;
    return Object.values(memberPoints).reduce((sum, p) => sum + p, 0);
  }, [scoringMode, memberPoints, existingScore]);

  const [teamState, teamAction, teamPending] = useActionState(saveTeamScore, undefined);
  const [isBreakdownPending, setIsBreakdownPending] = useState(false);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);

  const handleMemberPointsChange = (memberId: string, value: string) => {
    const points = parseInt(value) || 0;
    setMemberPoints(prev => ({ ...prev, [memberId]: Math.max(0, points) }));
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

  const isLockedForUser = existingScore && !isAdmin;

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
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color || '#1A1A1A' }} />
          <span className="font-bold uppercase tracking-tight">{team.name}</span>
          {existingScore && (
            <Badge variant="success" className="text-[8px]">Submitted</Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-xl font-black",
            currentTotal > game.maxPoints ? "text-red-500" : "text-[#1A1A1A]"
          )}>
            {currentTotal} / {game.maxPoints}
          </span>
          <ChevronDown size={18} className={cn("text-[#999999] transition-transform", isExpanded && "rotate-180")} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 bg-[#F9F9F9]/30 space-y-6">
          {isLockedForUser ? (
            <div className="space-y-4">
              <StatusMessage 
                variant="warning"
                title="Score Submitted"
                message="This score has already been recorded. Please request an edit if a correction is needed."
              />
              <div className="flex justify-end">
                <RequestEditModal 
                  game={game} 
                  team={team} 
                  existingScore={existingScore as { id: string; totalPoints: number; scoringMode: 'TEAM_TOTAL' | 'MEMBER_BREAKDOWN'; memberScores: { teamMemberId: string; points: number }[] }} 
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Scoring Method</p>
                  <div className="flex bg-white rounded-lg p-1 border border-[#1A1A1A]/5">
                    <button
                      onClick={() => setScoringMode('TEAM_TOTAL')}
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                        scoringMode === 'TEAM_TOTAL' ? "bg-[#1A1A1A] text-white shadow-md" : "text-[#666666] hover:bg-[#F9F9F9]"
                      )}
                    >
                      Team Total
                    </button>
                    <button
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#999999]">Team Total</p>
                  <p className="text-2xl font-black">{currentTotal} pts</p>
                </div>
              </div>

              {scoringMode === 'TEAM_TOTAL' ? (
                <form action={teamAction} className="space-y-4">
                  <input type="hidden" name="gameId" value={game.id} />
                  <input type="hidden" name="teamId" value={team.id} />
                  
                  {teamState?.error && (
                    <StatusMessage variant="error" title="Error" message={teamState.error} />
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Team Total Points</label>
                    <Input 
                      name="totalPoints" 
                      type="number" 
                      defaultValue={existingScore?.totalPoints || 0}
                      className="h-14 text-2xl font-black text-center"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]/5">
                    <Button type="submit" disabled={teamPending} className="font-bold text-xs">
                      <Save size={14} className="mr-2" />
                      {existingScore ? 'Update Score' : 'Save Team Score'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {breakdownError && (
                    <StatusMessage variant="error" title="Error" message={breakdownError} />
                  )}

                  {team.members.length === 0 ? (
                    <EmptyState 
                      title="No members"
                      description="Add members to this team first or use Team Total mode."
                      className="py-4 bg-white rounded-xl"
                      icon={<Users size={20} />}
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-[#1A1A1A]/5">
                          <div className="flex items-center gap-2 truncate">
                             <User size={14} className="text-[#999999]" />
                             <span className="text-sm font-bold truncate">{member.name}</span>
                          </div>
                          <Input 
                            type="number" 
                            value={memberPoints[member.id] || 0}
                            onChange={(e) => handleMemberPointsChange(member.id, e.target.value)}
                            className="w-20 text-center h-10 font-black"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#1A1A1A]/5">
                    <Button 
                      onClick={onSaveBreakdown} 
                      disabled={isBreakdownPending || team.members.length === 0} 
                      className="font-bold text-xs"
                    >
                      <Save size={14} className="mr-2" />
                      {existingScore ? 'Update Breakdown' : 'Save Breakdown'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}
