/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, X, Sparkles, Code, MessageSquare, Database, ArrowRight, RefreshCw } from 'lucide-react';

export interface InterviewTip {
  id: string;
  category: 'Coding' | 'Behavioral' | 'System Design' | 'Mindset';
  title: string;
  advice: string;
}

const INTERVIEW_TIPS: InterviewTip[] = [
  {
    id: 'tip_1',
    category: 'Coding',
    title: 'Explain Bruteforce First',
    advice: 'Never jump straight into the optimal solution. Clearly define the brute-force approach first, write or state its O(N²) time/space complexity, then explain why and how you plan to optimize it.'
  },
  {
    id: 'tip_2',
    category: 'Behavioral',
    title: 'Focus on your individual "I"',
    advice: 'When answering behavioral questions, avoid saying "we did this" too much. Interviewers want to know what your specific role, action, and individual contribution was.'
  },
  {
    id: 'tip_3',
    category: 'System Design',
    title: 'Agree on SLA Boundaries first',
    advice: 'Before sketching databases, clarify the estimated Read/Write ratio, Daily Active Users (DAU), and whether consistency or availability is the core priority for the specific feature.'
  },
  {
    id: 'tip_4',
    category: 'Coding',
    title: 'Two-Pointer Technique',
    advice: 'If an array is sorted, we can often solve search, summation, or subsequence problems in O(N) time using two pointers (one at the start, one at the end) instead of nested loops.'
  },
  {
    id: 'tip_5',
    category: 'Behavioral',
    title: 'QUANTIFY your STAR Results',
    advice: 'A STAR method response is weak without numbers. Always say how much latency was improved (e.g., "reduced P99 by 40%") or how much dev-time was saved by your system.'
  },
  {
    id: 'tip_6',
    category: 'System Design',
    title: 'Database Sharding Trade-offs',
    advice: 'Only suggest database sharding as a last resort. Always propose vertical scaling, read-replicas, and memory-layered caching (Redis) first to avoid cross-shard transaction complexity.'
  },
  {
    id: 'tip_7',
    category: 'Coding',
    title: 'Speak while you type',
    advice: 'An interview is not a quiet exam room. If you fall silent for more than 45 seconds while writing a helper function, explain out loud what variables you are defining.'
  },
  {
    id: 'tip_8',
    category: 'Mindset',
    title: 'Mistakes are signal, not noise',
    advice: 'If you realize your algorithm has a bug, do not panic! Verbalizing how you discovered the bug and walking through the fix scores higher than a perfect first-time run done in silence.'
  }
];

export default function TipOfTheDay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<InterviewTip>(INTERVIEW_TIPS[0]);
  const [progress, setProgress] = useState(100);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-trigger on component mount (which represents entering/logging into the dashboard)
  useEffect(() => {
    // Select random tip on initial session mount
    const randomTip = INTERVIEW_TIPS[Math.floor(Math.random() * INTERVIEW_TIPS.length)];
    setCurrentTip(randomTip);
    
    // Smooth delay before slide up
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Set up auto-dismiss timer and countdown progress bar
  useEffect(() => {
    if (!isVisible || hasInteracted) return;

    const totalDuration = 10000; // 10 seconds display
    const updateInterval = 100; // update progress bar every 100ms
    const decrement = (updateInterval / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          setIsVisible(false);
          return 0;
        }
        return prev - decrement;
      });
    }, updateInterval);

    return () => clearInterval(progressTimer);
  }, [isVisible, hasInteracted, currentTip]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleShuffleTip = () => {
    setHasInteracted(true); // Stop auto-closing once they engage
    setProgress(100);
    
    // Choose a different tip to avoid immediate repeats
    let nextTip;
    do {
      nextTip = INTERVIEW_TIPS[Math.floor(Math.random() * INTERVIEW_TIPS.length)];
    } while (nextTip.id === currentTip.id && INTERVIEW_TIPS.length > 1);

    setCurrentTip(nextTip);
  };

  if (!isVisible) {
    // Hidden trigger so they can always recall it if they want
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          id="recall-tip-btn"
          onClick={() => {
            setIsVisible(true);
            setProgress(100);
            setHasInteracted(false);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-950 text-white font-mono text-[10px] font-bold border border-zinc-800 shadow-lg hover:bg-zinc-900 transition-all active:scale-95 cursor-pointer hover:border-emerald-500/50"
          title="Recall Interview Tip of the Day"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 animate-pulse" />
          <span>DAILY TIP 💡</span>
        </button>
      </div>
    );
  }

  // Choose appropriate categories icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Coding':
        return <Code className="w-4 h-4 text-violet-500" />;
      case 'Behavioral':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'System Design':
        return <Database className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Coding':
        return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'Behavioral':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'System Design':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div 
      id="tip-of-the-day-notification" 
      className="fixed bottom-4 right-4 z-40 w-full max-w-sm bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 animate-slide-up"
    >
      {/* Visual Header Grid & Progress timer indicator */}
      <div className="relative">
        {/* Animated Timer Progress Line */}
        {!hasInteracted && (
          <div 
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Category Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border flex items-center justify-center ${getCategoryColor(currentTip.category)}`}>
              {getCategoryIcon(currentTip.category)}
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">INTERVIEW TIP OF THE DAY</span>
              <h5 className="text-xs font-extrabold text-zinc-950 font-sans mt-0.5 leading-none">
                {currentTip.title}
              </h5>
            </div>
          </div>

          <button
            id="dismiss-tip-btn"
            onClick={handleDismiss}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
            title="Dismiss Notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Detailed bite-sized advice text */}
        <p className="text-xs text-zinc-650 leading-relaxed font-normal font-sans">
          "{currentTip.advice}"
        </p>

        {/* Interaction controls */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">
            {hasInteracted ? '🔍 MANUAL PLAYBACK' : '⏳ Auto-dismissing soon'}
          </span>

          <button
            id="shuffle-tip-btn"
            onClick={handleShuffleTip}
            className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-600 hover:text-emerald-700 hover:underline transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-emerald-500" />
            <span>SHUFFLE TIP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
