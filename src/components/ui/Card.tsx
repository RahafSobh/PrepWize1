import { motion } from 'motion/react';

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function Card({ children, className = '', hover = true, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`card-surface p-6 ${hover ? '' : 'hover:border-[var(--color-border)]'} ${className}`}
    >
      {children}
    </motion.div>
  );
}
