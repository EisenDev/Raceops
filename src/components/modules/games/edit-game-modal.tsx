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
}

export function EditGameModal({ game }: EditGameModalProps) {
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
      <Button variant="ghost" size="sm" className="font-bold text-xs" onClick={handleOpen}>
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
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Edit Game</CardTitle>
          <p className="text-sm text-[#666666]">Update game parameters or delete game.</p>
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
              <Input name="name" defaultValue={game.name} required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Max Points</label>
              <Input type="number" name="maxPoints" defaultValue={game.maxPoints} required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Status</label>
              <select name="status" defaultValue={game.status} className="flex h-12 w-full rounded-lg border border-[#1A1A1A]/10 bg-white px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20">
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Mechanics</label>
              <textarea 
                name="mechanics" 
                rows={4}
                defaultValue={game.mechanics || ''}
                className="flex w-full rounded-lg border border-[#1A1A1A]/10 bg-white px-4 py-3 text-sm transition-colors placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/20 focus-visible:border-[#1A1A1A]"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-[#1A1A1A]/5">
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isPending || isDeleting}>
                <Save size={18} className="mr-2" />
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold text-red-600 hover:bg-red-50 border-red-100" 
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
