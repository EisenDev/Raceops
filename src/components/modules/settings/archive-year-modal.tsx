'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { archiveCurrentYear } from '@/lib/actions/history';
import { X, Archive } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export function ArchiveYearModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleArchive = async () => {
    setIsPending(true);
    setError(null);
    const result = await archiveCurrentYear(year);
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      setShowConfirm(false);
    } else {
      setIsOpen(false);
      setIsPending(false);
      setShowConfirm(false);
      window.location.reload(); // Force refresh to update sidebar
    }
  };

  if (!isOpen) {
    return (
      <Button variant="outline" className="w-full h-12" onClick={() => setIsOpen(true)}>
        <Archive size={18} className="mr-2" />
        Archive Current Data
      </Button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-md shadow-2xl relative text-left">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <CardHeader>
            <CardTitle>Archive Year</CardTitle>
            <p className="text-sm text-muted-foreground opacity-60">Move current data to a historical year.</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && <StatusMessage variant="error" title="Error" message={error} />}

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-200/60 leading-relaxed font-medium">
               This will move all current teams, games, and scores to the selected year. The current dashboard will be cleared for a new event.
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white">Target Year</label>
              <Input 
                type="number" 
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="h-12 bg-black border-white/10"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <Button 
                variant="secondary" 
                className="flex-1 text-xs" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 text-xs" onClick={() => setShowConfirm(true)}>
                Archive Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleArchive}
        isPending={isPending}
        title="Confirm Archival"
        description={`This will move all current data to Year ${year} and clear the active dashboard. This action is irreversible.`}
        confirmText="Yes, Archive Data"
      />
    </>
  );
}
