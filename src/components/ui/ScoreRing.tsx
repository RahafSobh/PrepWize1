interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  label?: string;
  color?: 'accent' | 'teal';
}

export default function ScoreRing({
  score,
  maxScore = 5,
  size = 160,
  label,
  color = 'accent',
}: ScoreRingProps) {
  const stroke = color === 'accent' ? '#6C63FF' : '#3ECFB2';
  const pct = Math.min(score / maxScore, 1);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-bg-hover)"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-bold text-[var(--color-text-primary)] leading-none">
            {score}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] font-mono mt-1">
            / {maxScore}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">{label}</span>
      )}
    </div>
  );
}
