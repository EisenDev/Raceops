import { PageSection } from '@/components/ui/PageSection';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Shield, Key, Save, Lock, Unlock, Download, Terminal, Settings } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { getSetting, lockScores, unlockScores, updateEventName } from '@/lib/actions/settings';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  // We only allow admins here via middleware, but extra safety
  if (!isAdmin) return null;

  const eventName = await getSetting('eventName') || 'Infosoft Amazing Race 2026';
  const scoresLocked = (await getSetting('scoresLocked')) === 'true';
  const lockedAt = await getSetting('lockedAt');
  const lockedBy = await getSetting('lockedBy');

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Settings</h1>
          <p className="text-sm text-muted-foreground font-medium">Configure global event parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <Card className="p-8 bg-white/[0.02] border-white/5 space-y-8">
            <h3 className="text-xl font-semibold text-white">Scoring lock</h3>

            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 rounded-xl bg-black/20 border border-white/5">
                 <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Master lock</p>
                    <p className="text-xs text-muted-foreground opacity-60">Prevent all score modifications</p>
                    {scoresLocked && lockedAt && (
                      <p className="text-[10px] text-accent font-medium pt-2">
                        Locked on {new Date(lockedAt).toLocaleString()} by {lockedBy}
                      </p>
                    )}
                 </div>
                 <Badge variant={scoresLocked ? 'error' : 'success'} className="px-3 py-1">
                    {scoresLocked ? 'Locked' : 'Open'}
                 </Badge>
              </div>

              <form action={async () => {
                'use server';
                if (scoresLocked) await unlockScores();
                else await lockScores();
              }}>
                <Button 
                  type="submit" 
                  variant={scoresLocked ? 'outline' : 'primary'} 
                  className="w-full h-12 text-sm"
                >
                  {scoresLocked ? (
                    <><Unlock size={16} className="mr-2" /> Unlock scores</>
                  ) : (
                    <><Lock size={16} className="mr-2" /> Lock all scores</>
                  )}
                </Button>
              </form>
            </div>
          </Card>

          <Card className="p-8 bg-white/[0.02] border-white/5">
            <h3 className="text-xl font-semibold text-white mb-8">Event details</h3>

            <form action={async (formData: FormData) => {
              'use server';
              const name = formData.get('eventName') as string;
              if (name) await updateEventName(name);
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground ml-1">Event name</label>
                <Input 
                  name="eventName" 
                  defaultValue={eventName} 
                  className="h-12 bg-black border-white/10 text-white" 
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full h-12 text-sm">
                <Save size={16} className="mr-2 opacity-60" /> Save changes
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-10">
           <Card variant="ivory" className="p-10 border-none shadow-xl">
              <h3 className="text-2xl font-semibold mb-6">Data export</h3>
              <div className="space-y-8">
                 <p className="text-sm font-medium opacity-60 leading-relaxed">
                    Download official results for ceremony preparation and record keeping.
                 </p>
                 <div className="flex flex-col gap-3">
                    <a href="/api/export/scores" download>
                       <Button className="w-full h-14 text-sm bg-black text-white hover:bg-black/90">
                          <Download size={16} className="mr-2 opacity-60" /> Standings Summary
                       </Button>
                    </a>
                    <a href="/api/export/details" download>
                       <Button variant="secondary" className="w-full h-14 text-sm bg-black/5 text-black border-black/10">
                          <Terminal size={16} className="mr-2 opacity-60" /> Full audit log
                       </Button>
                    </a>
                 </div>
              </div>
           </Card>

           <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h4 className="text-xs font-semibold text-muted-foreground opacity-40 uppercase tracking-widest">Rules</h4>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="opacity-50">Ranking logic</span>
                    <span className="text-white">Highest total points</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-medium pt-3 border-t border-white/5">
                    <span className="opacity-50">Aggregation</span>
                    <span className="text-white">Automatic recursive</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
