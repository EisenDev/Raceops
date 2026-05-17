'use client';

import { useState } from 'react';
import { PageSection } from '@/components/ui/PageSection';
import { CodeRunnerForm } from './code-runner-form';
import { ChallengeBrowser } from './challenge-browser';
import { AttemptHistory } from './attempt-history';
import { LanguageTrack, CodeChallenge, CodeRunnerAttempt, Team, User } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Cpu, HardDrive, History } from 'lucide-react';

interface CodeRunnerShellProps {
  teams: { id: string, name: string }[];
  challenges: Pick<CodeChallenge, 'id' | 'languageTrack' | 'difficulty' | 'title' | 'status'>[];
  attempts: (CodeRunnerAttempt & {
    team: Team;
    challenge: CodeChallenge | null;
    submittedBy: User;
  })[];
  isAdmin: boolean;
}

const languages = [
  { label: 'Python', value: LanguageTrack.PYTHON },
  { label: 'PHP', value: LanguageTrack.PHP_NATIVE },
  { label: 'Laravel', value: LanguageTrack.LARAVEL },
  { label: 'Vue', value: LanguageTrack.VUE },
  { label: 'JavaScript', value: LanguageTrack.JAVASCRIPT },
];

export function CodeRunnerShell({ teams, challenges, attempts, isAdmin }: CodeRunnerShellProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageTrack>(LanguageTrack.PYTHON);

  const filteredChallenges = challenges.filter(c => c.languageTrack === selectedLang);

  return (
    <PageSection className="py-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Code Runner</h1>
          <p className="text-sm text-muted-foreground font-medium">Verify team submissions for technical challenges.</p>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 p-1 bg-white/[0.02] rounded-xl w-fit border border-white/5">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Validation Form */}
        <div className="lg:col-span-7 space-y-10">
           <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Submission portal</p>
              <CodeRunnerForm 
                teams={teams} 
                selectedLanguage={selectedLang} 
              />
           </div>
        </div>

        {/* Right: Challenge Browser & History */}
        <div className="lg:col-span-5 space-y-12">
           <div className="space-y-12">
              <div className="space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Challenge library</p>
                 <ChallengeBrowser challenges={filteredChallenges} isAdmin={isAdmin} />
              </div>
              
              <div className="pt-10 border-t border-white/5 space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground opacity-50 px-1">Recent attempts</p>
                 <AttemptHistory attempts={attempts} />
              </div>
           </div>
        </div>
      </div>
    </PageSection>
  );
}
