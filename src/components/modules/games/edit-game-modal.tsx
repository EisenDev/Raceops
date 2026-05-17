'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { updateGame, deleteGame } from '@/lib/actions/games';
import { X, Save, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface EditGameModalProps {
  game: {
    id: string;
    name: string;
    maxPoints: number;
    mechanics: string | null;
    status: string;
  };
  disabled?: boolean;
}

export function EditGameModal({ game, disabled = false }: EditGameModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = () => {
    setModalKey(prev => prev + 1);
    setIsOpen(true);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="font-semibold text-xs" onClick={handleOpen} disabled={disabled}>
        Edit Game
      </Button>

      {isOpen && (
        <EditGameModalContent 
          key={modalKey}
          game={game}
          onClose={() => setIsOpen(false)}
          onShowDelete={() => setShowDeleteConfirm(true)}
          isDeleting={isDeleting}
        />
      )}

      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          setIsDeleting(true);
          const result = await deleteGame(game.id);
          if (result?.error) {
            alert(result.error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
          } else {
            setShowDeleteConfirm(false);
            setIsOpen(false);
          }
        }}
        title="Delete Game"
        description={`Are you sure you want to delete ${game.name}? This action cannot be undone.`}
        confirmText="Delete Game"
        isPending={isDeleting}
      />
    </>
  );
}

function EditGameModalContent({ 
  game, 
  onClose,
  onShowDelete,
  isDeleting
}: { 
  game: { id: string; name: string; maxPoints: number; mechanics: string | null; status: string }; 
  onClose: () => void,
  onShowDelete: () => void,
  isDeleting: boolean
}) {
  const updateGameWithId = updateGame.bind(null, game.id);
  const [state, action, isPending] = useActionState(updateGameWithId, undefined);

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
          <CardTitle>Edit Game</CardTitle>
          <p className="text-sm text-muted-foreground opacity-60">Update game details or remove mission.</p>
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
              <Input name="name" defaultValue={game.name} required />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Status</label>
              <select name="status" defaultValue={game.status} className="flex h-12 w-full rounded-lg border border-white/10 bg-black px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Live</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Game instructions</label>
              <textarea 
                name="mechanics" 
                rows={4}
                defaultValue={game.mechanics || ''}
                className="flex w-full rounded-lg border border-white/10 bg-white px-4 py-3 text-sm transition-colors text-black placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent"
              />
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
              <Button type="submit" className="w-full h-12 rounded-xl text-sm font-semibold" disabled={isPending || isDeleting}>
                <Save size={18} className="mr-2" />
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 border-red-500/20" 
                onClick={onShowDelete}
                disabled={isPending || isDeleting}
              >
                <Trash2 size={18} className="mr-2" />
                Delete Game
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
