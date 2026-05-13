'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { generateTechOpsCards } from '@/lib/actions/techops';
import { Plus, Settings2 } from 'lucide-react';

export function CardGenerator() {
  const [state, action, isPending] = useActionState(generateTechOpsCards, undefined);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className="text-[#999999]" />
          <CardTitle>Card Generator</CardTitle>
        </div>
        <p className="text-xs text-[#666666]">Admin tool to create physical game cards.</p>
      </CardHeader>
      <CardContent className="pt-4">
        <form action={action} className="space-y-4">
          {state?.error && (
            <StatusMessage variant="error" title="Error" message={state.error} />
          )}
          {state?.success && (
            <StatusMessage variant="success" title="Success" message="Cards generated successfully." />
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Card Type</label>
            <select 
              name="type" 
              className="w-full h-11 rounded-lg border border-[#1A1A1A]/10 bg-white px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all"
              required
            >
               <option value="FRONTEND">Frontend</option>
               <option value="BACKEND">Backend</option>
               <option value="DATABASE">Database</option>
               <option value="DEVOPS">DevOps</option>
               <option value="CLOUD">Cloud</option>
               <option value="SECURITY">Security</option>
               <option value="BONUS">Bonus</option>
               <option value="RARE">Rare</option>
               <option value="BUGGED">Bugged</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Amount</label>
            <Input type="number" name="amount" defaultValue={10} min={1} max={100} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Custom Points (Optional)</label>
            <Input type="number" name="points" placeholder="Leave blank for default" />
          </div>

          <Button type="submit" className="w-full h-12 font-bold text-xs" disabled={isPending}>
            <Plus size={16} className="mr-2" />
            {isPending ? 'Generating...' : 'Generate Cards'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
