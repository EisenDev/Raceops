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
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Add New Game</CardTitle>
          <p className="text-sm text-muted-foreground opacity-60">Define a standard game mission.</p>
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
              <label className="text-xs font-semibold text-white">Game name</label>
              <Input name="name" placeholder="e.g. Speed Logic" required autoFocus />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Game instructions</label>
              <textarea 
                name="mechanics" 
                rows={4}
                className="flex w-full rounded-lg border border-white/10 bg-white px-4 py-3 text-sm transition-colors text-black placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent"
                placeholder="How to play this game..."
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
              <Button type="submit" className="flex-1 text-xs" disabled={isPending}>
                {isPending ? 'Saving...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
