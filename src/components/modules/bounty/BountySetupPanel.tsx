'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { generateTeamBounties } from '@/lib/actions/bounty';
import { Target, Plus } from 'lucide-react';

export function BountySetupPanel() {
  const [isPending, setIsPending] = useState(false);

  const handleGenerate = async () => {
    setIsPending(true);
    const result = await generateTeamBounties();
    if (result.error) alert(result.error);
    setIsPending(false);
  };

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-[#999999]" />
          <CardTitle>Bounty Setup</CardTitle>
        </div>
        <p className="text-xs text-[#666666]">Admin tool to initialize team bounties.</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
           <p className="text-sm text-[#666666] leading-relaxed">
             This will generate 1 unique bounty code per team. Teams that already have an active or claimed bounty will be skipped.
           </p>
           <Button 
             onClick={handleGenerate} 
             disabled={isPending}
             className="w-full h-12 font-bold text-xs"
           >
             <Plus size={16} className="mr-2" />
             {isPending ? 'Generating...' : 'Generate Team Bounties'}
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
