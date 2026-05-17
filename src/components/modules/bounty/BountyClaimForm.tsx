'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { claimBounty } from '@/lib/actions/bounty';
import { Target, Trophy } from 'lucide-react';
import { isScoresLocked } from '@/lib/actions/settings';
import { useState, useEffect } from 'react';

interface BountyClaimFormProps {
  teams: { id: string; name: string }[];
}

export function BountyClaimForm({ teams }: BountyClaimFormProps) {
  const [state, action, isPending] = useActionState(claimBounty, undefined);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    isScoresLocked().then(setIsLocked);
  }, []);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#999999]" />
          <CardTitle>Record Bounty Claim</CardTitle>
        </div>
        <p className="text-xs text-[#666666]">Submit a captured bounty code for a team.</p>
      </CardHeader>
      <CardContent className="pt-4">
        {isLocked && (
          <StatusMessage 
            variant="error"
            title="Bounty Locked"
            message="Final scores are locked. Bounty claims are disabled."
            className="mb-4"
          />
        )}
        <form action={action} className="space-y-4">
          {state?.error && (
            <StatusMessage variant="error" title="Error" message={state.error} />
          )}
          {state?.success && (
            <StatusMessage variant="success" title="Success" message="Bounty claimed successfully!" />
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Claiming Team</label>
            <select 
              name="claimingTeamId" 
              className="w-full h-11 rounded-lg border border-[#1A1A1A]/10 bg-white px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all"
              required
            >
               <option value="">Select Team...</option>
               {teams.map((team) => (
                 <option key={team.id} value={team.id}>{team.name}</option>
               ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Bounty Code</label>
            <Input 
              name="code" 
              placeholder="e.g. BNT-YEL-7K2" 
              required 
              className="uppercase font-black tracking-widest"
            />
          </div>

          <Button type="submit" className="w-full h-12 font-bold text-xs" disabled={isPending || isLocked}>
            <Target size={16} className="mr-2" />
            {isPending ? 'Validating...' : 'Record Bounty'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
