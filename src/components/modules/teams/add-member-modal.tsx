'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { addTeamMember } from '@/lib/actions/teams';
import { UserPlus, X } from 'lucide-react';

interface AddMemberModalProps {
  teamId: string;
  teamName: string;
}

export function AddMemberModal({ teamId, teamName }: AddMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsPending(true);
    setError(null);

    const result = await addTeamMember(teamId, name);
    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setIsOpen(false);
      setName('');
      setIsPending(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] uppercase font-black tracking-widest" onClick={() => setIsOpen(true)}>
        <UserPlus size={12} className="mr-2" />
        Add Member
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-sm shadow-2xl relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Add Member</CardTitle>
          <p className="text-sm text-[#666666]">Adding to <strong>{teamName}</strong></p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Member Name</label>
              <Input 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1" 
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending || !name}>
                {isPending ? 'Adding...' : 'Add Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
