/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import {
  AgentContext,
  AgentMessage,
  AgentSessionSummary,
  AgentTurnResponse,
  InterviewPreferences,
  InterviewSession,
  UserProfile,
} from '../types';

interface InterviewCoachAgentProps {
  profile: UserProfile;
  sessions: InterviewSession[];
  onBack: () => void;
  onApplyLaunchSetup: (preferences: InterviewPreferences) => void;
}

function buildAgentContext(profile: UserProfile, sessions: InterviewSession[]): AgentContext {
  const recentSessions: AgentSessionSummary[] = sessions
    .filter((s) => s.status === 'completed')
    .slice(0, 8)
    .map((s) => ({
      type: s.preferences.type,
      difficulty: s.preferences.difficulty,
      role: s.preferences.role,
      overallScore: s.feedback?.overallScore,
      weaknesses: (s.feedback?.weaknesses || []).slice(0, 3),
      strengths: (s.feedback?.strengths || []).slice(0, 3),
      createdAt: s.createdAt,
    }));

  return {
    profile: {
      name: profile.name,
      plan: profile.plan,
      role: profile.role,
      simulationsCompleted: profile.simulationsCompleted,
      streakCount: profile.streakCount,
    },
    recentSessions,
  };
}

const WELCOME: AgentMessage = {
  role: 'coach',
  text: "Hi! I'm Prep Coach. Tell me what you want to work on — I'll use your recent sessions and goals to suggest what to practice next.",
  timestamp: new Date().toISOString(),
};

export default function InterviewCoachAgent({
  profile,
  sessions,
  onBack,
  onApplyLaunchSetup,
}: InterviewCoachAgentProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [pendingAction, setPendingAction] = useState<AgentTurnResponse['suggestedAction']>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bottomRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, pendingAction, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError('');
    const userMsg: AgentMessage = {
      role: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setPendingAction(undefined);
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: trimmed,
          messages,
          context: buildAgentContext(profile, sessions),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Coach request failed');
      }

      const data = (await res.json()) as AgentTurnResponse;
      const coachMsg: AgentMessage = {
        role: 'coach',
        text: data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, coachMsg]);
      if (data.suggestedAction?.type === 'launch_setup') {
        setPendingAction(data.suggestedAction);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to reach Prep Coach.';
      setError(message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div id="prep-coach-screen" className="max-w-3xl mx-auto flex flex-col min-h-[70vh]">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition text-zinc-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Prep Coach</h2>
          </div>
          <p className="text-xs text-zinc-500">AI interview preparation agent — recommendations require your confirmation.</p>
        </div>
      </div>

      <div
        className="flex-1 bg-white border border-zinc-200 rounded-3xl shadow-xs flex flex-col overflow-hidden"
        role="region"
        aria-label="Prep Coach conversation"
      >
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-h-[50vh] md:max-h-[55vh]">
          {messages.map((m, idx) => (
            <div
              key={`${m.timestamp}-${idx}`}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-emerald-50/80 border border-emerald-100 text-zinc-800'
                }`}
              >
                {m.role === 'coach' && (
                  <span className="block text-[10px] font-mono font-bold uppercase text-emerald-700 mb-1">Prep Coach</span>
                )}
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start" aria-live="polite" aria-busy="true">
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Prep Coach is thinking…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {pendingAction?.type === 'launch_setup' && (
          <div
            className="mx-4 mb-2 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50"
            role="region"
            aria-label="Recommended practice session"
          >
            <p className="text-xs font-mono font-bold uppercase text-emerald-800 mb-2">Recommended next session</p>
            <p className="text-sm text-zinc-700 mb-3">
              {pendingAction.label ||
                `${pendingAction.preferences.type} · ${pendingAction.preferences.difficulty} · ${pendingAction.preferences.role}`}
            </p>
            <ul className="text-xs text-zinc-600 mb-3 space-y-0.5">
              <li>Style: {pendingAction.preferences.style}</li>
              <li>Language: {pendingAction.preferences.language}</li>
              {pendingAction.preferences.topic && <li>Topic: {pendingAction.preferences.topic}</li>}
            </ul>
            <button
              type="button"
              id="apply-coach-recommendation-btn"
              onClick={() => onApplyLaunchSetup(pendingAction.preferences)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Apply recommendation
            </button>
          </div>
        )}

        {error && (
          <p className="mx-4 mb-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <form
          className="border-t border-zinc-200 p-4 flex gap-2 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
        >
          <label htmlFor="prep-coach-input" className="sr-only">
            Message Prep Coach
          </label>
          <textarea
            id="prep-coach-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="e.g. What should I practice next?"
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Send message to Prep Coach"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
