/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Shield, User, Mail, Lock, CheckCircle, ArrowRight, Github, Award, Terminal } from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';

interface AuthScreenProps {
  onAuthSuccess: (profile: UserProfile) => void;
  mockProfile: UserProfile;
}

const AVATAR_PRESETS = [
  { emoji: '🚀', label: 'Code Explorer', desc: 'Masters fast product iteration and agile scripting.' },
  { emoji: '🧠', label: 'Algo Guru', desc: 'Expert in dynamic programming and structural data complexity.' },
  { emoji: '⚙️', label: 'System Pioneer', desc: 'Architects robust multi-region replicas and fault-tolerant message brokers.' },
  { emoji: '⚡', label: 'High-Scale Builder', desc: 'Thrives under extreme load, caching optimizations, and low-latency metrics.' },
  { emoji: '💼', label: 'Product Lead Tech', desc: 'Balances high technical craftsmanship with clean stakeholder delivery.' },
];

export default function AuthScreen({ onAuthSuccess, mockProfile }: AuthScreenProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState(mockProfile.name || 'Maya');
  const [email, setEmail] = useState(mockProfile.email || 'rahafsobh12@gmail.com');
  const [password, setPassword] = useState('password123');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (tab === 'signup' && !name) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (tab === 'signup' && !termsAccepted) {
      setErrorMessage('You must accept the terms of use.');
      return;
    }

    setIsLoading(true);
    
    // Smooth simulation of OAuth credentials handshake
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(tab === 'login' ? 'Welcome back to PrepWise!' : 'Account registered successfully!');
      
      const emojiChar = AVATAR_PRESETS[avatarIndex].emoji;
      
      setTimeout(() => {
        onAuthSuccess({
          name: tab === 'signup' ? name : 'Maya',
          email: email,
          avatarUrl: emojiChar,
          plan: mockProfile.plan || 'Free',
          simulationsCompleted: mockProfile.simulationsCompleted || 0,
          role: mockProfile.role || 'Full Stack',
          streakCount: mockProfile.streakCount || 3
        });
      }, 800);
    }, 1200);
  };

  const fillQuickDemo = (type: 'maya' | 'senior') => {
    if (type === 'maya') {
      setName('Maya');
      setEmail('rahafsobh12@gmail.com');
      setPassword('secureMaya77');
      setAvatarIndex(1); // Algo Guru
    } else {
      setName('Alex Chen');
      setEmail('alex.chen@google.com');
      setPassword('faangArchitect');
      setAvatarIndex(2); // System Pioneer
    }
  };

  return (
    <div id="auth-screen-root" className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3.5xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3.5xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[900px] z-10">
        
        {/* Left Side: Creative Promo Banner panel */}
        <div className="lg:col-span-5 bg-zinc-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle gradient pattern */}
          <div className="absolute inset-0 bg-radial from-zinc-800/40 via-transparent to-transparent opacity-80" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">FAANG Prep</span>
                <h3 className="text-lg font-black tracking-tight font-display bg-linear-to-r from-white via-zinc-100 to-amber-300 bg-clip-text text-transparent">PrepWise AI</h3>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold tracking-tight font-display leading-tight">
                Unlock matching FAANG assessments through creative AI simulation.
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Experience dynamic whiteboard system designs, algorithmic debugger code sandboxes, and behavioral STAR interviews with automatic SLA-backed report analytics.
              </p>
            </div>
          </div>

          {/* Testimonial widget inside Banner */}
          <div className="space-y-4 pt-12 relative z-10 border-t border-zinc-850">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-amber-400 text-xs">★</span>
              ))}
            </div>
            <p className="text-xs text-zinc-300 italic">
              "The dynamic whiteboard simulator completely removed my interview stress. I successfully cleared my systems assessment at Google!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-semibold">
                👩‍💻
              </div>
              <div>
                <p className="text-[11px] font-bold">Rahaf Sobh</p>
                <p className="text-[9px] text-zinc-500">Associate Engineering Lead</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form controls (Interactive Login/Signup) */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between">
          
          {/* Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <div className="flex gap-4">
                <button
                  id="auth-signup-tab"
                  onClick={() => { setTab('signup'); setErrorMessage(''); }}
                  className={`text-sm font-bold pb-2 relative transition cursor-pointer ${tab === 'signup' ? 'text-zinc-950 font-extrabold border-b-2 border-emerald-500' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  Create Account
                </button>
                <button
                  id="auth-login-tab"
                  onClick={() => { setTab('login'); setErrorMessage(''); }}
                  className={`text-sm font-bold pb-2 relative transition cursor-pointer ${tab === 'login' ? 'text-zinc-950 font-extrabold border-b-2 border-emerald-500' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  Sign In
                </button>
              </div>
              
              <div className="flex gap-2">
                <span className="text-[10px] bg-zinc-100 text-zinc-600 font-mono px-2 py-0.5 rounded font-bold uppercase">v2.4 Live</span>
              </div>
            </div>

            {/* Title / Onboarding messages */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-lg font-extrabold text-zinc-900 tracking-tight font-display">
                {tab === 'signup' ? 'Get Started with PrepWise AI' : 'Welcome back to your Workplace'}
              </h1>
              <p className="text-xs text-zinc-500">
                {tab === 'signup' 
                  ? 'Sign up to build your personalised profile and start compiling algorithms.' 
                  : 'Log in to recover your previous prep history sessions or check grades.'}
              </p>
            </div>

            {/* Errors / Success feedback boxes */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-4 font-medium flex items-center gap-2">
                <span>⚠️</span> {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl mb-4 font-bold flex items-center gap-3">
                <span className="animate-bounce">🎉</span> {successMessage}
              </div>
            )}

            {/* Quick Presets helper triggers */}
            <div id="quick-auth-helpers" className="mb-5 p-3.5 bg-zinc-50 border border-zinc-150 rounded-2xl">
              <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-zinc-400" />
                Frictionless Sandbox Presets (One-click fill)
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  id="fill-maya-preset"
                  onClick={() => fillQuickDemo('maya')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg text-zinc-700 active:scale-95 transition cursor-pointer"
                >
                  Fill Maya's credentials (rahafsobh12)
                </button>
                <button
                  type="button"
                  id="fill-senior-preset"
                  onClick={() => fillQuickDemo('senior')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg text-zinc-700 active:scale-95 transition cursor-pointer"
                >
                  Alex Chen (Google Senior)
                </button>
              </div>
            </div>

            {/* Primary Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1.5 uppercase font-mono">My Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      id="auth-name-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Maya Sobh"
                      className="w-full text-xs pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/15 outline-none font-medium text-zinc-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1.5 uppercase font-mono">My Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    id="auth-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahafsobh12@gmail.com"
                    className="w-full text-xs pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/15 outline-none font-medium text-zinc-805"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1.5 uppercase font-mono">Password (Min 6 chars)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    id="auth-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs pl-10 pr-3 py-2.5 bg-white border border-zinc-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/15 outline-none font-mono text-zinc-800"
                  />
                </div>
              </div>

              {/* Dynamic Interactive Onboarding: Avatar / Role Persona Picker */}
              {tab === 'signup' && (
                <div className="pt-2 space-y-2.5">
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase font-mono">
                    Select Your Candidate Archetype (Interactive)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarIndex(idx)}
                        className={`p-3 rounded-2xl border text-center transition active:scale-95 flex flex-col items-center gap-1 cursor-pointer ${avatarIndex === idx ? 'border-emerald-500 bg-emerald-50/40 text-emerald-850 ring-2 ring-emerald-500/10' : 'border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50'}`}
                      >
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="text-[8px] font-bold leading-tight uppercase font-mono block truncate max-w-full">{preset.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Persona description display */}
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <p className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider">
                      Selected Archetype: {AVATAR_PRESETS[avatarIndex].label}
                    </p>
                    <p className="text-xs text-zinc-650 italic mt-0.5">
                      &ldquo;{AVATAR_PRESETS[avatarIndex].desc}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {tab === 'signup' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auth-terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="auth-terms-checkbox" className="text-[11px] text-zinc-500 select-none">
                    I agree to the simulated SLA constraints & accept mock terms.
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                className="w-full bg-zinc-950 text-white font-bold py-3 px-4 rounded-xl group hover:bg-zinc-900 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <span className="text-xs font-mono">Synchronous Validation handshakes...</span>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wider">
                      {tab === 'signup' ? 'Complete Interactive Registration' : 'Secure Workspace Access'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Interactive SSO OAuth shortcuts */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase shrink-0">Or Quick Launch With:</span>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      onAuthSuccess({
                        name: 'Maya',
                        email: 'rahafsobh12@gmail.com',
                        avatarUrl: '🚀',
                        plan: 'Free',
                        simulationsCompleted: 2,
                        role: 'Full Stack',
                        streakCount: mockProfile.streakCount || 3
                      });
                    }, 800);
                  }}
                  className="flex-1 bg-white border border-zinc-200 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer active:scale-95"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub OAuth
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      onAuthSuccess({
                        name: 'Maya',
                        email: 'rahafsobh12@gmail.com',
                        avatarUrl: '🧠',
                        plan: 'Free',
                        simulationsCompleted: 2,
                        role: 'Full Stack',
                        streakCount: mockProfile.streakCount || 3
                      });
                    }, 800);
                  }}
                  className="flex-1 bg-white border border-zinc-200 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition cursor-pointer active:scale-95"
                >
                  <span className="text-emerald-500 font-bold">G</span>
                  Google SSO
                </button>
              </div>
            </div>

          </div>

          {/* SLA assurance */}
          <div className="mt-8 border-t border-zinc-150 pt-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              SLA Security Assurance
            </span>
            <span>Uptime: 99.5%</span>
          </div>

        </div>

      </div>
    </div>
  );
}
