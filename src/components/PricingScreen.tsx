import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

interface PricingScreenProps {
  currentProfile: UserProfile;
  onClose: () => void;
  onUpdatePlan: (newPlan: 'Free' | 'Starter' | 'Pro' | 'Career+') => void;
}

const TIERS = [
  {
    name: 'Free' as const,
    price: '$0',
    desc: 'Core simulation with basic AI feedback.',
    features: ['3 sessions / month', 'Algo & Behavioral tracks', 'Basic score reports', 'Progress dashboard'],
    highlight: false,
  },
  {
    name: 'Starter' as const,
    price: '$9.99',
    desc: 'More sessions and detailed reports.',
    features: ['20 sessions / month', 'All interview tracks', 'Detailed AI feedback', 'Role-specific paths'],
    highlight: false,
  },
  {
    name: 'Pro' as const,
    price: '$24.99',
    desc: 'Unlimited practice with system design.',
    features: ['Unlimited sessions', 'System Design whiteboard', 'Strict FAANG-style feedback', 'Full analytics history'],
    highlight: true,
  },
  {
    name: 'Career+' as const,
    price: '$49.99',
    desc: 'Premium coaching and voice simulation.',
    features: ['Everything in Pro', 'Voice-based interviewer', 'Speech-to-text logging', 'Priority support'],
    highlight: false,
  },
];

export default function PricingScreen({ currentProfile, onClose, onUpdatePlan }: PricingScreenProps) {
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = () => {
    if (!checkoutPlan) return;
    setIsProcessing(true);
    setTimeout(() => {
      onUpdatePlan(checkoutPlan as 'Free' | 'Starter' | 'Pro' | 'Career+');
      setIsProcessing(false);
      setCheckoutPlan(null);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12 relative"
    >
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <Card hover={false} className="max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-mono text-[var(--color-accent-alt)] uppercase tracking-wider">Checkout</p>
                <h4 className="text-lg font-bold text-[var(--color-text-primary)] mt-1">Upgrade to {checkoutPlan}</h4>
              </div>
              <button onClick={() => setCheckoutPlan(null)} disabled={isProcessing} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer">Cancel</button>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {TIERS.find((t) => t.name === checkoutPlan)?.price}/month — mock transaction for demo.
            </p>
            <div className="relative mb-4">
              <input defaultValue="4242 4242 4242 4242" className="input-field font-mono pr-10" readOnly />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <Button variant="primary" className="w-full" icon={Shield} onClick={handlePurchase} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Confirm purchase'}
            </Button>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={onClose} className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)]">Pricing</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Current plan: {currentProfile.plan}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier, i) => {
          const isCurrent = tier.name === currentProfile.plan;
          return (
            <div key={tier.name}>
            <Card
              delay={i * 0.07}
              hover={!tier.highlight}
              className={tier.highlight ? 'border-[var(--color-accent)] ring-1 ring-[rgba(108,99,255,0.3)]' : ''}
            >
              {tier.highlight && (
                <span className="text-[10px] font-mono font-bold text-[var(--color-accent)] uppercase">Popular</span>
              )}
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-2">{tier.name}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{tier.desc}</p>
              <p className="text-[28px] font-bold font-mono text-[var(--color-text-primary)] mt-4">
                {tier.price}<span className="text-sm font-normal text-[var(--color-text-muted)]">/mo</span>
              </p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs text-[var(--color-text-secondary)]">
                    <Check className="w-3.5 h-3.5 text-[var(--color-accent-alt)] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? 'primary' : 'secondary'}
                className="w-full mt-6"
                disabled={isCurrent}
                onClick={() => !isCurrent && setCheckoutPlan(tier.name)}
              >
                {isCurrent ? 'Current plan' : `Select ${tier.name}`}
              </Button>
            </Card>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
