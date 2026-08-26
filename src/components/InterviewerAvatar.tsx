import { motion } from 'motion/react';

interface InterviewerAvatarProps {
  isThinking?: boolean;
  size?: number;
  className?: string;
}

const NODES = [
  { cx: 50, cy: 20, delay: 0 },
  { cx: 76, cy: 35, delay: 0.3 },
  { cx: 76, cy: 65, delay: 0.6 },
  { cx: 50, cy: 80, delay: 0.9 },
  { cx: 24, cy: 65, delay: 1.2 },
  { cx: 24, cy: 35, delay: 1.5 },
];

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
  [0, 3], [1, 4], [2, 5],
];

export default function InterviewerAvatar({
  isThinking = true,
  size = 64,
  className = '',
}: InterviewerAvatarProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#3ECFB2" />
          </linearGradient>
        </defs>

        {CONNECTIONS.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].cx}
            y1={NODES[a].cy}
            x2={NODES[b].cx}
            y2={NODES[b].cy}
            stroke="url(#hex-grad)"
            strokeWidth="1.5"
            strokeOpacity={0.5}
            animate={
              isThinking
                ? { strokeOpacity: [0.3, 0.8, 0.3] }
                : { strokeOpacity: 0.4 }
            }
            transition={
              isThinking
                ? { duration: 1.4, repeat: Infinity, delay: i * 0.1 }
                : { duration: 0.3 }
            }
          />
        ))}

        {NODES.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="6"
            fill="url(#hex-grad)"
            animate={
              isThinking
                ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
                : { scale: 1, opacity: 0.85 }
            }
            transition={
              isThinking
                ? { duration: 1.4, repeat: Infinity, delay: node.delay }
                : { duration: 0.3 }
            }
          />
        ))}

        <circle cx="50" cy="50" r="8" fill="#1A1D27" stroke="url(#hex-grad)" strokeWidth="2" />
      </svg>
    </div>
  );
}
