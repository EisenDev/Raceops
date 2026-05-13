'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { deleteTeamMember } from '@/lib/actions/teams';
import { X } from 'lucide-react';

interface DeleteMemberButtonProps {
  memberId: string;
}

export function DeleteMemberButton({ memberId }: DeleteMemberButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (confirm('Remove this member?')) {
      setIsPending(true);
      const result = await deleteTeamMember(memberId);
      if (result.error) {
        alert(result.error);
        setIsPending(false);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0 text-red-400 opacity-0 group-hover:opacity-100"
      onClick={handleDelete}
      disabled={isPending}
    >
      <X size={14} />
    </Button>
  );
}
