import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, ChevronDown, ThumbsUp, AlertTriangle } from 'lucide-react';
import { InterviewSession } from '../types';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import ScoreRing from './ui/ScoreRing';

interface FeedbackReportScreenProps {
  session: InterviewSession;
  onClose: () => void;
  onRetake: () => void;
}

const CATEGORIES = [
  { field: 'technicalAccuracyScore', label: 'Technical' },
  { field: 'communicationSkillsScore', label: 'Communication' },
  { field: 'answerQualityScore', label: 'Problem Solving' },
];

function CategoryBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-mono font-bold text-[var(--color-text-primary)]">{score}/5</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
    </div>
  );
}

export default function FeedbackReportScreen({ session, onClose, onRetake }: FeedbackReportScreenProps) {
  const report = session.feedback;
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  if (!report) return null;

  const codeQuality = Math.round(
    (report.technicalAccuracyScore + report.answerQualityScore) / 2
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)]">Interview Report</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={session.preferences.type} />
            <Badge variant={session.preferences.difficulty} />
            <span className="text-xs text-[var(--color-text-muted)]">{session.preferences.role}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={RefreshCw} onClick={onRetake}>Try Again</Button>
          <Button variant="primary" onClick={onRetake}>New Interview</Button>
        </div>
      </div>

      <Card hover={false} className="flex flex-col items-center py-10">
        <ScoreRing score={report.overallScore} size={180} label="Overall Score" />
      </Card>

      <Card hover={false}>
        <h3 className="text-xs font-mono font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-5">
          Category Scores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CATEGORIES.map(({ field, label }) => (
            <div key={field}>
              <CategoryBar
                label={label}
                score={report[field as keyof typeof report] as number}
              />
            </div>
          ))}
          <CategoryBar label="Code Quality" score={codeQuality} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover={false} className="border-l-2 border-l-[var(--color-success)]">
          <h3 className="text-sm font-semibold text-[var(--color-success)] flex items-center gap-2 mb-4">
            <ThumbsUp className="w-4 h-4" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {report.strengths.map((s, i) => (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-success)] font-mono shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card hover={false} className="border-l-2 border-l-[var(--color-warning)]">
          <h3 className="text-sm font-semibold text-[var(--color-warning)] flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" />
            Improvements
          </h3>
          <ul className="space-y-2">
            {report.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-warning)] font-mono shrink-0">-</span>
                {w}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card hover={false}>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Question breakdown</h3>
        <div className="space-y-2">
          {report.improvementSuggestions.map((tip, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
              <button
                onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer"
              >
                <span>Focus area {i + 1}: {tip.slice(0, 50)}{tip.length > 50 ? '...' : ''}</span>
                <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${openAccordion === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openAccordion === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] pt-3">
                      {tip}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
