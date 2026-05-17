'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { updateTeam, deleteTeam } from '@/lib/actions/teams';
import { X, Save, Trash2, User } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface EditTeamModalProps {
  team: {
    id: string;
    name: string;
    color: string | null;
    assignedFacilitatorId?: string | null;
  };
  facilitators: { id: string; name: string }[];
  disabled?: boolean;
}

export function EditTeamModal({ team, facilitators, disabled = false }: EditTeamModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teamColor, setTeamColor] = useState(team.color || '#1A1A1A');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // We use a key to reset the action state whenever the modal is opened
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = () => {
    setTeamColor(team.color || '#1A1A1A');
    setModalKey(prev => prev + 1);
    setIsOpen(true);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpen} disabled={disabled}>
        Edit
      </Button>

      {isOpen && (
        <EditTeamModalContent 
          key={modalKey}
          team={team} 
          facilitators={facilitators}
          teamColor={teamColor}
          setTeamColor={setTeamColor}
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
          const result = await deleteTeam(team.id);
          if (result?.error) {
            alert(result.error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
          } else {
            setShowDeleteConfirm(false);
            setIsOpen(false);
          }
        }}
        title="Delete Team"
        description={`Are you sure you want to delete ${team.name}? This will also remove all its members. This action cannot be undone.`}
        confirmText="Delete Team"
        isPending={isDeleting}
      />
    </>
  );
}

function EditTeamModalContent({ 
  team, 
  facilitators,
  teamColor, 
  setTeamColor, 
  onClose,
  onShowDelete,
  isDeleting
}: { 
  team: { id: string; name: string; color: string | null; assignedFacilitatorId?: string | null }, 
  facilitators: { id: string; name: string }[],
  teamColor: string, 
  setTeamColor: (c: string) => void, 
  onClose: () => void,
  onShowDelete: () => void,
  isDeleting: boolean
}) {
  const updateTeamWithId = updateTeam.bind(null, team.id);
  const [state, action, isPending] = useActionState(updateTeamWithId, undefined);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <Card className="w-full max-w-lg shadow-2xl relative my-8 text-left">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader>
          <CardTitle>Edit Team</CardTitle>
          <p className="text-sm text-[#666666]">Update team identity or remove team.</p>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-6">
            {state?.error && (
              <StatusMessage 
                variant="error"
                title="Update Failed"
                message={state.error}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Team Name</label>
                <Input name="name" defaultValue={team.name} required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Assigned Facilitator</label>
                <div className="relative">
                  <select 
                    name="assignedFacilitatorId" 
                    defaultValue={team.assignedFacilitatorId || ""}
                    className="flex h-12 w-full rounded-lg border border-[#1A1A1A]/10 bg-white pl-10 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all appearance-none"
                  >
                    <option value="">No Facilitator</option>
                    {facilitators.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <User size={16} className="absolute left-3 top-4 text-[#999999]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Team Color</label>
              <div className="flex gap-3">
                <Input 
                  type="color"
                  name="color" 
                  value={teamColor}
                  onChange={(e) => setTeamColor(e.target.value)}
                  className="w-14 h-12 p-1 cursor-pointer shrink-0" 
                />
                <Input 
                  value={teamColor}
                  onChange={(e) => setTeamColor(e.target.value)}
                  className="flex-1 font-mono uppercase"
                  placeholder="#000000"
                />
              </div>
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
                Delete Team
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
