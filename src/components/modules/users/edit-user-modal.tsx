'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { updateUser, deleteUser } from '@/lib/actions/users';
import { X, Save, Trash2, Key, User as UserIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface EditUserModalProps {
  user: {
    id: string;
    name: string;
    username: string;
    role: string;
  };
  currentUser: {
    id: string;
    role: string;
  };
}

export function EditUserModal({ user, currentUser }: EditUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const isAdmin = currentUser.role === 'ADMIN';
  const isSelf = currentUser.id === user.id;

  const handleOpen = () => {
    setModalKey(prev => prev + 1);
    setIsOpen(true);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="text-xs h-10 px-4" onClick={handleOpen}>
        Edit
      </Button>

      {isOpen && (
        <EditUserModalContent 
          key={modalKey}
          user={user}
          currentUser={currentUser}
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
          const result = await deleteUser(user.id);
          if (result?.error) {
            alert(result.error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
          } else {
            setShowDeleteConfirm(false);
            setIsOpen(false);
          }
        }}
        title="Delete Account"
        description={`Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`}
        confirmText="Delete Account"
        isPending={isDeleting}
      />
    </>
  );
}

function EditUserModalContent({ 
  user, 
  currentUser,
  onClose,
  onShowDelete,
  isDeleting
}: { 
  user: { id: string; name: string; username: string; role: string },
  currentUser: { id: string; role: string },
  onClose: () => void,
  onShowDelete: () => void,
  isDeleting: boolean
}) {
  const updateUserWithId = updateUser.bind(null, user.id);
  const [state, action, isPending] = useActionState(updateUserWithId, undefined);

  const isAdmin = currentUser.role === 'ADMIN';
  const isSelf = currentUser.id === user.id;

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <Card className="w-full max-w-lg shadow-2xl relative my-8 text-left border-white/5 bg-[#0F0F0F]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader className="pb-4">
          <CardTitle className="text-white">Edit Profile</CardTitle>
          <p className="text-sm text-muted-foreground">Update account credentials and details.</p>
        </CardHeader>

        <CardContent className="pt-6">
          <form action={action} className="space-y-6">
            {state?.error && (
              <StatusMessage 
                variant="error"
                title="Update Failed"
                message={state.error}
              />
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Full Name</label>
                <div className="relative">
                  <Input name="name" defaultValue={user.name} required className="pl-10" />
                  <UserIcon size={16} className="absolute left-3 top-4 text-muted-foreground/40" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Username</label>
                <Input name="username" defaultValue={user.username} required />
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-4">Security Update (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-muted-foreground/40">New Password</label>
                    <div className="relative">
                      <Input name="password" type="password" placeholder="••••••••" className="pl-10" />
                      <Key size={16} className="absolute left-3 top-4 text-muted-foreground/40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-muted-foreground/40">Confirm New Password</label>
                    <Input name="confirmPassword" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground/40 mt-2 italic">Leave blank to keep current password.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isPending || isDeleting}>
                <Save size={18} className="mr-2" />
                {isPending ? 'Saving...' : 'Update Account'}
              </Button>
              
              {isAdmin && !isSelf && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl font-bold text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-all" 
                  onClick={onShowDelete}
                  disabled={isPending || isDeleting}
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Staff Account
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
