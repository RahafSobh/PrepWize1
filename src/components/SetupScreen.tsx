import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Code2, MessageSquare, Brain, Clock, ChevronDown } from 'lucide-react';
import { InterviewPreferences, InterviewType, DifficultyLevel, JobRole, InterviewerStyle } from '../types';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';

interface SetupScreenProps {
  onBack: () => void;
  onLaunch: (preferences: InterviewPreferences) => void;
  userPlan: string;
}

const TYPE_OPTIONS: { type: InterviewType; icon: typeof Code2; desc: string }[] = [
  { type: 'Algo', icon: Code2, desc: 'Coding sandbox with unit tests' },
  { type: 'Behavioral', icon: MessageSquare, desc: 'STAR-method evaluation' },
  { type: 'System Design', icon: Brain, desc: 'Architecture whiteboarding' },
];

const EST_DURATION: Record<InterviewType, string> = {
  Algo: '~45 min',
  Behavioral: '~30 min',
  'System Design': '~60 min',
};

export default function SetupScreen({ onBack, onLaunch, userPlan }: SetupScreenProps) {
  const [type, setType] = useState<InterviewType>('Algo');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Mid-Level');
  const [role, setRole] = useState<JobRole>('Full Stack');
  const [language, setLanguage] = useState('Javascript');
  const [style, setStyle] = useState<InterviewerStyle>('Neutral');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunch({
      type,
      difficulty,
      role,
      language: type === 'Algo' ? language : 'English',
      style,
      topic: topic.trim() || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)] tracking-tight">Interview Setup</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Configure your session parameters</p>
        </div>
      </div>

      <Card hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider font-mono">
              Interview Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TYPE_OPTIONS.map(({ type: t, icon: Icon, desc }) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-4 rounded-[var(--radius-lg)] border text-left transition cursor-pointer flex flex-col gap-3 h-28 ${
                    type === t
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] ring-1 ring-[rgba(108,99,255,0.3)]'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-base)] hover:border-[rgba(108,99,255,0.4)]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${type === t ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{t}</h4>
                      {type === t && <Badge variant={t} />}
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Language</label>
              {type === 'Algo' ? (
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field appearance-none pr-10 cursor-pointer"
                  >
                    {['Javascript', 'Typescript', 'Python', 'Java', 'C++'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
                </div>
              ) : (
                <input className="input-field opacity-60" value="English" readOnly />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Difficulty</label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="input-field appearance-none pr-10 cursor-pointer"
                >
                  <option value="Junior">Junior (0-2 YOE)</option>
                  <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
                  <option value="Senior">Senior (5-8 YOE)</option>
                  <option value="Staff">Staff / Tech Lead (8+ YOE)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Target Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as JobRole)}
                  className="input-field appearance-none pr-10 cursor-pointer"
                >
                  {(['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'System Architect'] as JobRole[]).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Interviewer Style</label>
              <div className="relative">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as InterviewerStyle)}
                  className="input-field appearance-none pr-10 cursor-pointer"
                >
                  <option value="Friendly">Friendly</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Strict">Strict</option>
                  <option value="Challenging">Challenging</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Focus Topic <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dynamic Programming, Rate Limiter, Leadership under pressure..."
              className="input-field"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Clock className="w-4 h-4" />
              <span>Estimated duration:</span>
              <Badge variant={difficulty}>{EST_DURATION[type]}</Badge>
            </div>
            <Button type="submit" variant="primary" icon={Play} className="shadow-[var(--shadow-glow)]">
              Start Interview
            </Button>
          </div>
        </form>
      </Card>

      {userPlan === 'Free' && type === 'System Design' && (
        <p className="text-xs text-[var(--color-warning)] text-center">
          System Design requires a Pro plan. You will be prompted to upgrade.
        </p>
      )}
    </motion.div>
  );
}
