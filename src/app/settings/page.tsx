import { SectionHeader } from '@/components/ui/SectionHeader';
import { PageSection } from '@/components/ui/PageSection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Key, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PageSection className="py-4">
      <SectionHeader 
        title="System Settings" 
        description="Configure event parameters and administrative security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
               <Key size={18} className="text-[#999999]" />
               <CardTitle>Change Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">New Password</label>
              <Input type="password" placeholder="••••••••" className="rounded-xl border-[#1A1A1A]/10" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Confirm Password</label>
              <Input type="password" placeholder="••••••••" className="rounded-xl border-[#1A1A1A]/10" />
            </div>
            <Button className="w-full h-12 rounded-xl font-bold">Update Password</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
               <Shield size={18} className="text-[#999999]" />
               <CardTitle>Event Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-bold">Lock Scoring</p>
                  <p className="text-xs text-[#666666]">Prevent facilitators from submitting scores.</p>
               </div>
               <div className="w-12 h-6 bg-[#1A1A1A]/10 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
            </div>
            <div className="flex items-center justify-between">
               <div>
                  <p className="font-bold">Public Leaderboard</p>
                  <p className="text-xs text-[#666666]">Allow external displays to show live rankings.</p>
               </div>
               <div className="w-12 h-6 bg-[#1A1A1A] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
            </div>
            <Button variant="secondary" className="w-full h-12 rounded-xl font-bold">
              <Save size={16} className="mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageSection>
  );
}
