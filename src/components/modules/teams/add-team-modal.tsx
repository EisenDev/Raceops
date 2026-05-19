'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { createTeam } from '@/lib/actions/teams';
import { X, Plus, Trash2, User } from 'lucide-react';

interface AddTeamModalProps {
  facilitators: { id: string; name: string }[];
}

export function AddTeamModal({ facilitators }: AddTeamModalProps) {
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
        Add Team
      </Button>
    );
  }

  return (
    <AddTeamModalContent 
      key={modalKey}
      facilitators={facilitators}
      onClose={() => setIsOpen(false)}
    />
  );
}

function AddTeamModalContent({ 
  onClose, 
  facilitators 
}: { 
  onClose: () => void; 
  facilitators: { id: string; name: string }[] 
}) {
  const [teamColor, setTeamColor] = useState('#1A1A1A');
  const [members, setMembers] = useState(['']);
  const [state, action, isPending] = useActionState(createTeam, undefined);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const addMemberRow = () => setMembers([...members, '']);
  const removeMemberRow = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers.length > 0 ? newMembers : ['']);
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

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
          <CardTitle>Add New Team</CardTitle>
          <p className="text-sm text-[#666666]">Create a team and add its initial members.</p>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-6">
            {state?.error && (
              <StatusMessage variant="error" title="Validation Error" message={state.error} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Team Name</label>
                <Input name="name" placeholder="e.g. Yellow" required autoFocus />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Assigned Facilitator</label>
                <div className="relative">
                  <select 
                    name="assignedFacilitatorId" 
                    className="flex h-12 w-full rounded-lg border border-[#1A1A1A]/10 bg-white pl-10 pr-4 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="text-[#1A1A1A] bg-white">No Facilitator</option>
                    {facilitators.map(f => (
                      <option key={f.id} value={f.id} className="text-[#1A1A1A] bg-white">{f.name}</option>
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Initial Members</label>
                <Button type="button" variant="ghost" size="sm" onClick={addMemberRow} className="h-7 text-[10px] font-black uppercase tracking-widest">
                  <Plus size={12} className="mr-1" /> Add Row
                </Button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {members.map((member, i) => (
                  <div key={i} className="flex gap-2 group">
                    <Input 
                      name="member" 
                      placeholder={`Member ${i + 1} Name`} 
                      value={member}
                      onChange={(e) => handleMemberChange(i, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-600 px-2 shrink-0"
                      onClick={() => removeMemberRow(i)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
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
                {isPending ? 'Saving...' : 'Save Team'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
