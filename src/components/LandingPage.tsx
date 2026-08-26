import { motion } from 'motion/react';
import { Brain, Code2, MessageSquare, ChevronRight, Users } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Logo from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const INTERVIEW_TYPES = [
  {
    type: 'Algo',
    icon: Code2,
    title: 'Algorithm',
    desc: 'Live coding with test cases, complexity analysis, and real-time hints.',
    badgeClass: 'badge-algo',
  },
  {
    type: 'Behavioral',
    icon: MessageSquare,
    title: 'Behavioral',
    desc: 'STAR-method coaching with communication scoring and follow-up probes.',
    badgeClass: 'badge-behavioral',
  },
  {
    type: 'System Design',
    icon: Brain,
    title: 'System Design',
    desc: 'Architecture whiteboarding with scalability and trade-off evaluation.',
    badgeClass: 'badge-system',
  },
];

const PRICING_TIERS = [
  { name: 'Free', price: '$0', sessions: '3 sessions / month', highlight: false },
  { name: 'Starter', price: '$9.99', sessions: '20 sessions / month', highlight: false },
  { name: 'Pro', price: '$24.99', sessions: 'Unlimited sessions', highlight: true },
];

export default function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen hero-gradient">
      <nav className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-6 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-sm font-bold text-[var(--color-text-primary)]">PrepWise AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onSignIn}>Sign in</Button>
          <Button variant="primary" onClick={onGetStarted}>Get started</Button>
        </div>
      </nav>

      <section className="max-w-[1200px] mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-mono text-[var(--color-accent-alt)] uppercase tracking-widest mb-4">
            AI-Powered Interview Simulation
          </p>
          <h1 className="text-[36px] font-extrabold text-[var(--color-text-primary)] tracking-[-0.03em] leading-[1.2] max-w-2xl mx-auto">
            Practice interviews that feel real.
          </h1>
          <p className="text-[18px] text-[var(--color-text-secondary)] mt-4 max-w-xl mx-auto leading-relaxed">
            Simulate FAANG-level technical, behavioral, and system design interviews.
            Get scored feedback in minutes — built for developers under pressure.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button variant="primary" onClick={onGetStarted} icon={ChevronRight}>
              Start practicing free
            </Button>
            <Button variant="secondary" onClick={onSignIn}>Sign in</Button>
          </div>
        </motion.div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INTERVIEW_TYPES.map((item, i) => (
            <div key={item.type} role="button" tabIndex={0} onClick={onGetStarted} onKeyDown={(e) => e.key === 'Enter' && onGetStarted()} className="cursor-pointer">
            <Card delay={i * 0.07}>
              <div className={`inline-flex p-2 rounded-[var(--radius-md)] ${item.badgeClass} mb-4`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)]">
                Start session <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-surface)] py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-center gap-3 text-sm text-[var(--color-text-secondary)]">
          <Users className="w-4 h-4 text-[var(--color-accent)]" />
          <span>Join <strong className="text-[var(--color-text-primary)]">5,000+</strong> developers preparing for their next role</span>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">Simple, transparent pricing</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Start free. Upgrade when you need more sessions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRICING_TIERS.map((tier, i) => (
            <div key={tier.name}>
            <Card delay={i * 0.07} hover={!tier.highlight} className={tier.highlight ? 'border-[var(--color-accent)] ring-1 ring-[rgba(108,99,255,0.3)]' : ''}>
              {tier.highlight && (
                <span className="text-[10px] font-mono font-bold text-[var(--color-accent)] uppercase tracking-wider">Most popular</span>
              )}
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mt-2">{tier.name}</h3>
              <p className="text-[28px] font-bold text-[var(--color-text-primary)] mt-3 font-mono">{tier.price}<span className="text-sm font-normal text-[var(--color-text-muted)]">/mo</span></p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">{tier.sessions}</p>
              <Button variant={tier.highlight ? 'primary' : 'secondary'} className="w-full mt-6" onClick={onGetStarted}>
                {tier.name === 'Free' ? 'Get started' : 'Upgrade'}
              </Button>
            </Card>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-text-muted)]">
        <p>&copy; 2026 PrepWise AI. Built for developers, by developers.</p>
      </footer>
    </div>
  );
}
