/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArrowRight, BarChart3, Menu, MessageSquare, Sparkles, Target, X, Zap } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onStartPracticing: () => void;
}

const NAV = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'why-prepwize', label: 'Why PrepWize' },
] as const;

const STEPS = [
  {
    title: 'Choose your target role',
    text: 'Set the role, interview type, and difficulty you want to practice.',
  },
  {
    title: 'Practice with your AI Interview Coach',
    text: 'Run a mock interview and talk through your answers in the simulator.',
  },
  {
    title: 'Receive personalized feedback and improve',
    text: 'Review scores, strengths, and what to change before the next session.',
  },
] as const;

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI-powered mock interviews',
    text: 'Practice Algo, Behavioral, and System Design interviews in the app.',
  },
  {
    icon: Sparkles,
    title: 'Personalized questions',
    text: 'Questions follow the role, difficulty, and topic you choose.',
  },
  {
    icon: Zap,
    title: 'Real-time feedback',
    text: 'The interviewer responds as you work, so you can adjust in the session.',
  },
  {
    icon: BarChart3,
    title: 'Interview performance insights',
    text: 'Each finished session includes scores, strengths, and weaknesses.',
  },
  {
    icon: Target,
    title: 'Practice tailored to the target role',
    text: 'Setup stays tied to the job you are preparing for.',
  },
] as const;

function scrollToSection(id: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

export default function LandingPage({ onStartPracticing }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <div id="landing-page" className="min-h-screen bg-zinc-50 text-zinc-900">
      <a
        href="#how-it-works"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-display text-base font-semibold tracking-tight text-zinc-950">PrepWize</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Page">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              id="start-practicing-nav-btn"
              type="button"
              onClick={onStartPracticing}
              className="hidden cursor-pointer rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:inline-flex"
            >
              Start Practicing
            </button>
            <button
              id="landing-menu-btn"
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-700 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="landing-mobile-nav" className="border-t border-zinc-200 px-4 py-3 md:hidden" aria-label="Page">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className="w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onStartPracticing}
                  className="mt-1 w-full cursor-pointer rounded-xl bg-zinc-950 px-3 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  Start Practicing
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="motion-safe:animate-slide-up">
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI interview practice
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Prepare Smarter. Interview Better.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              PrepWize is an AI-powered interview practice app. Run a mock interview for the role you want, then use the feedback to improve your next attempt.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                id="start-practicing-btn"
                type="button"
                onClick={onStartPracticing}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Start Practicing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                id="see-how-it-works-btn"
                type="button"
                onClick={() => goToSection('how-it-works')}
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-950 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                See How It Works
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Practice tracks</p>
            <ul className="mt-4 space-y-3">
              {['Algo', 'Behavioral', 'System Design'].map((track) => (
                <li key={track} className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                  <span className="text-sm font-medium text-zinc-900">{track}</span>
                  <span className="text-xs text-zinc-500">Mock interview</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              Choose a track, practice with the coach, and read the report when the session ends.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-t border-zinc-200 bg-white" aria-labelledby="how-it-works-heading">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <h2 id="how-it-works-heading" className="font-display text-3xl font-semibold tracking-tight text-zinc-950">
              How it works
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">Three steps from setup to a report you can act on.</p>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="scroll-mt-20" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <h2 id="features-heading" className="font-display text-3xl font-semibold tracking-tight text-zinc-950">
              Features
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">What you use inside a PrepWize practice session.</p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.title} className="rounded-3xl border border-zinc-200 bg-white p-6">
                    <Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    <h3 className="mt-4 text-base font-semibold text-zinc-950">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="why-prepwize" className="scroll-mt-20 border-t border-zinc-200 bg-white" aria-labelledby="why-prepwize-heading">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <h2 id="why-prepwize-heading" className="font-display text-3xl font-semibold tracking-tight text-zinc-950">
              Why PrepWize
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-zinc-600">
              <p>
                Preparing alone makes it easy to repeat the same answer without noticing what is unclear. A mock interview gives you a turn to respond, then feedback that points at the gap.
              </p>
              <p>
                PrepWize uses your role and recent sessions to shape the next practice run. You leave with scores, strengths, and concrete changes instead of a vague sense that it went fine.
              </p>
            </div>
          </div>
        </section>

        <section id="final-cta" className="px-4 py-16 md:px-6 md:py-20" aria-labelledby="final-cta-heading">
          <div className="mx-auto max-w-6xl rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-12 text-white md:px-12">
            <h2 id="final-cta-heading" className="font-display text-3xl font-semibold tracking-tight">
              Start your next practice session
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Sign in, pick a role, and run a mock interview. The report is there when you finish.
            </p>
            <button
              id="start-practicing-final-btn"
              type="button"
              onClick={onStartPracticing}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-medium text-zinc-950 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Start Practicing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <footer id="landing-footer" className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <div>
              <p className="font-display text-sm font-semibold text-zinc-950">PrepWize</p>
              <p className="text-xs text-zinc-500">AI interview practice</p>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className="cursor-pointer text-sm text-zinc-600 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onStartPracticing}
                  className="cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
                >
                  Start Practicing
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
