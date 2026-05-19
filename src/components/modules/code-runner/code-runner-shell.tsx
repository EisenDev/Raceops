'use client';

import { useState } from 'react';
import { PageSection } from '@/components/ui/PageSection';
import { CodeRunnerForm } from './code-runner-form';
import { ChallengeBrowser } from './challenge-browser';
import { AttemptHistory } from './attempt-history';
import { LanguageTrack, CodeChallenge, CodeRunnerAttempt, Team, User } from '@prisma/client';
import { cn } from '@/lib/utils';
import { HardDrive, History, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeRunnerShellProps {
  teams: { id: string, name: string }[];
  challenges: Pick<CodeChallenge, 'id' | 'languageTrack' | 'difficulty' | 'title' | 'status'>[];
  attempts: (CodeRunnerAttempt & {
    team: Team;
    challenge: CodeChallenge | null;
    submittedBy: User;
  })[];
  isAdmin: boolean;
  assignedTeam?: { id: string, name: string } | null;
}

const languages = [
  { label: 'Python', value: LanguageTrack.PYTHON },
  { label: 'PHP', value: LanguageTrack.PHP_NATIVE },
  { label: 'Laravel', value: LanguageTrack.LARAVEL },
  { label: 'Vue', value: LanguageTrack.VUE },
  { label: 'JavaScript', value: LanguageTrack.JAVASCRIPT },
];

export function CodeRunnerShell({ teams, challenges, attempts, isAdmin, assignedTeam }: CodeRunnerShellProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageTrack>(LanguageTrack.PYTHON);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const filteredChallenges = challenges.filter(c => c.languageTrack === selectedLang);
  
  // For facilitators, only show attempts for their assigned team
  const filteredAttempts = !isAdmin && assignedTeam 
    ? attempts.filter(a => a.teamId === assignedTeam.id)
    : attempts;

  // Block facilitators with no assigned team
  if (!isAdmin && !assignedTeam) {
    return (
      <PageSection className="py-20 text-center">
        <HardDrive size={48} className="mx-auto text-muted-foreground opacity-20 mb-6" />
        <h2 className="text-2xl font-semibold text-white mb-2">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You must be assigned to a team to access the Code Runner terminal. Please contact the administrator.
        </p>
      </PageSection>
    );
  }

  return (
    <PageSection className="py-4 pb-24 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Code Runner</h1>
          <p className="text-sm text-muted-foreground font-medium">Verify team submissions for technical challenges.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        {/* Language Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white/[0.02] rounded-xl w-fit border border-white/5">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setSelectedLang(lang.value)}
              className={cn(
                "px-6 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                selectedLang === lang.value 
                  ? "bg-accent text-black shadow-md" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <Button 
          variant="secondary" 
          onClick={() => setIsHistoryOpen(true)}
          className="h-10 text-xs px-6 border-white/10 hover:bg-white/5"
        >
          <Clock size={16} className="mr-2 opacity-60" />
          View recent attempts
        </Button>
      </div>

      <div className={cn(
        "grid grid-cols-1 gap-12 transition-all duration-500",
        isAdmin ? "lg:grid-cols-12" : "max-w-4xl"
      )}>
        {/* Left: Validation Form */}
        <div className={cn(
          isAdmin ? "lg:col-span-7" : "col-span-1",
          "space-y-10"
        )}>
           <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Submission portal</p>
              <CodeRunnerForm 
                teams={teams} 
                selectedLanguage={selectedLang} 
                assignedTeam={assignedTeam}
              />
           </div>
        </div>

        {/* Right: Challenge Browser (Admin Only in main view) */}
        {isAdmin && (
          <div className="lg:col-span-5 space-y-12">
             <div className="space-y-12">
                <div className="space-y-4">
                   <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Challenge library</p>
                   <ChallengeBrowser challenges={filteredChallenges} isAdmin={isAdmin} />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Right Floating Drawer for History */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-all"
          onClick={() => setIsHistoryOpen(false)}
        >
          <div 
            className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/5 shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <History size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Recent Attempts</h3>
                  <p className="text-xs text-muted-foreground">Showing history for {isAdmin ? 'all teams' : assignedTeam?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <AttemptHistory attempts={filteredAttempts} />
          </div>
        </div>
      )}
    </PageSection>
  );
}
