'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { createGame } from '@/lib/actions/games';
import { X, Plus } from 'lucide-react';

export function AddGameModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = () => {
    setModalKey(prev => prev + 1);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <Button onClick={handleOpen}>
        <Plus size={18} className="mr-2" />
        Add Game
      </Button>
    );
  }

  return (
    <AddGameModalContent 
      key={modalKey}
      onClose={() => setIsOpen(false)}
    />
  );
}

function AddGameModalContent({ onClose }: { onClose: () => void }) {
  const [state, action, isPending] = useActionState(createGame, undefined);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl relative text-left">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Add New Game</CardTitle>
          <p className="text-sm text-[#666666]">Define a standard Amazing Race game.</p>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-4">
            {state?.error && (
              <StatusMessage 
                variant="error"
                title="Error"
                message={state.error}
              />
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Game Name</label>
              <Input name="name" placeholder="e.g. Speed Logic" required autoFocus />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Max Points</label>
              <Input type="number" name="maxPoints" defaultValue={100} required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Mechanics (Optional)</label>
              <textarea 
                name="mechanics" 
                rows={4}
                className="flex w-full rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-3 text-sm transition-colors placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20 focus-visible:border-[#1A1A1A]"
                placeholder="How to play this game..."
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
              <Button type="submit" className="flex-1 font-bold text-xs" disabled={isPending}>
                {isPending ? 'Saving...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
