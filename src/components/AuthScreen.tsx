import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, ArrowRight, Github, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';
import Button from './ui/Button';
import Card from './ui/Card';

interface AuthScreenProps {
  onAuthSuccess: (profile: UserProfile) => void;
  mockProfile: UserProfile;
  onBack?: () => void;
}

export default function AuthScreen({ onAuthSuccess, mockProfile, onBack }: AuthScreenProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState(mockProfile.name || 'Maya');
  const [email, setEmail] = useState(mockProfile.email || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required.'); return; }
    if (tab === 'signup' && !name) { setError('Name is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: tab === 'signup' ? name : mockProfile.name,
        email,
        avatarUrl: '',
        plan: mockProfile.plan || 'Free',
        simulationsCompleted: mockProfile.simulationsCompleted || 0,
        role: mockProfile.role || 'Full Stack',
        streakCount: mockProfile.streakCount || 1,
      });
    }, 900);
  };

  const quickAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({ ...mockProfile, avatarUrl: '' });
    }, 600);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">PrepWise AI</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <Card hover={false}>
          <div className="flex border-b border-[var(--color-border)] mb-6">
            {(['signup', 'login'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 pb-3 text-sm font-semibold transition cursor-pointer ${
                  tab === t
                    ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {t === 'signup' ? 'Sign up' : 'Sign in'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-[#EF444422] border border-[var(--color-error)] text-[var(--color-error)] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" placeholder="Your name" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@company.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 font-mono" placeholder="Min 6 characters" />
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading} icon={ArrowRight}>
              {isLoading ? 'Authenticating...' : tab === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] text-center mb-3">Or continue with</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" icon={Github} onClick={quickAuth} className="text-xs">GitHub</Button>
              <Button variant="secondary" onClick={quickAuth} className="text-xs">Google</Button>
            </div>
          </div>
        </Card>

        {onBack && (
          <button onClick={onBack} className="mt-4 w-full text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition cursor-pointer">
            Back to home
          </button>
        )}

        <p className="mt-6 text-center text-[10px] text-[var(--color-text-muted)] flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Secure authentication · SLA 99.5% uptime
        </p>
      </motion.div>
    </div>
  );
}
