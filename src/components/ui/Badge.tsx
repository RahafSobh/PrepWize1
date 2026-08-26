import type { ReactNode } from 'react';
import { InterviewType, DifficultyLevel } from '../../types';

type BadgeVariant = InterviewType | 'Easy' | 'Medium' | 'Hard' | DifficultyLevel;

const VARIANT_CLASS: Record<string, string> = {
  Algo: 'badge-algo',
  Behavioral: 'badge-behavioral',
  'System Design': 'badge-system',
  Easy: 'badge-easy',
  Medium: 'badge-medium',
  Hard: 'badge-hard',
  Junior: 'badge-easy',
  'Mid-Level': 'badge-medium',
  Senior: 'badge-hard',
  Staff: 'badge-hard',
};

interface BadgeProps {
  variant: BadgeVariant;
  children?: ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-semibold uppercase tracking-wide ${VARIANT_CLASS[variant] ?? 'badge-algo'} ${className}`}
    >
      {children ?? variant}
    </span>
  );
}
