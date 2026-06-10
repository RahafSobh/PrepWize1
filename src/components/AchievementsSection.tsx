/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle, Code, MessageSquare, Database, Trophy, Zap, Flame, Lock, Sparkles, ChevronDown, Check } from 'lucide-react';
import { InterviewSession } from '../types';

interface AchievementsSectionProps {
  sessions: InterviewSession[];
}

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  metric: string;
  unlockedEmoji: string;
  colorClass: string;
  icon: React.ComponentType<any>;
  checkUnlocked: (sessions: InterviewSession[]) => boolean;
}

const BADGES: BadgeItem[] = [
  {
    id: 'first_algo',
    name: 'First Coding Session',
    description: 'Compiled your first algorithmic challenge sandbox matching target requirements.',
    longDescription: 'Awarded immediately upon completing any technical coding / algorithmic interview simulation. Proves command over language-specific compilation handshakes.',
    metric: 'Complete 1 Algorithmic (Algo) simulation list.',
    unlockedEmoji: '💻',
    colorClass: 'from-emerald-500/20 to-emerald-600/5 stroke-emerald-500 text-emerald-600 border-emerald-200',
    icon: Code,
    checkUnlocked: (sessions) => sessions.some(s => s.preferences.type === 'Algo' && s.status === 'completed')
  },
  {
    id: 'star_expert',
    name: 'STAR Expert',
    description: 'Mastered situational questions using the structured behavioral framework.',
    longDescription: 'Recognises proficiency in decomposing behavioral answers into structured Situation, Task, Action, and Quantitative Result benchmarks graded by Gemini.',
    metric: 'Complete 1 Behavioral simulation.',
    unlockedEmoji: '⭐',
    colorClass: 'from-amber-500/20 to-amber-600/5 stroke-amber-500 text-amber-600 border-amber-200',
    icon: MessageSquare,
    checkUnlocked: (sessions) => sessions.some(s => s.preferences.type === 'Behavioral' && s.status === 'completed')
  },
  {
    id: 'sys_design_master',
    name: 'System Design Master',
    description: 'Architected high-capacity distributed systems with failovers & sharding limits.',
    longDescription: 'Indicates mastery of distributed layout blueprints, state partitioning configurations, horizontal replication protocols, and CAP trade-off discussions.',
    metric: 'Complete 1 System Design whiteboard simulation.',
    unlockedEmoji: '🏗️',
    colorClass: 'from-blue-500/20 to-blue-600/5 stroke-blue-500 text-blue-600 border-blue-200',
    icon: Database,
    checkUnlocked: (sessions) => sessions.some(s => s.preferences.type === 'System Design' && s.status === 'completed')
  },
  {
    id: 'adrenaline_junkie',
    name: 'Adrenaline Conqueror',
    description: 'Conquered high-pressure simulated environments driven by strict examiner personas.',
    longDescription: 'Awarded when you select and successfully complete any simulation set to Challinging or Strict reviewer style. Confirms confidence under extreme feedback loops.',
    metric: 'Complete any interview under "Strict" or "Challenging" style.',
    unlockedEmoji: '⚡',
    colorClass: 'from-orange-500/20 to-orange-600/5 stroke-orange-500 text-orange-600 border-orange-200',
    icon: Zap,
    checkUnlocked: (sessions) => sessions.some(s => s.status === 'completed' && (s.preferences.style === 'Strict' || s.preferences.style === 'Challenging'))
  },
  {
    id: 'high_velocity',
    name: 'FAANG Contender',
    description: 'Maintained a persistent mock assessment regimen comprising multiple attempts.',
    longDescription: 'Awarded is reserved for developers who complete 3 or more structured assessments across multiple disciplines to thoroughly map analytical skills.',
    metric: 'Complete 3 total simulation runs.',
    unlockedEmoji: '🔥',
    colorClass: 'from-rose-500/20 to-rose-600/5 stroke-rose-500 text-rose-600 border-rose-200',
    icon: Flame,
    checkUnlocked: (sessions) => sessions.filter(s => s.status === 'completed').length >= 3
  },
  {
    id: 'elite_score',
    name: 'Elite Score 5.0',
    description: 'Delivered an exceptional execution report achieving a perfect evaluation grade.',
    longDescription: 'The ultimate distinction for outstanding technical responses. Earned when dry runs, communication flow, and optimization depth score a perfect 5.0.',
    metric: 'Receive an overall AI Score of 5 in any report.',
    unlockedEmoji: '👑',
    colorClass: 'from-violet-500/20 to-violet-600/5 stroke-violet-500 text-violet-600 border-violet-200',
    icon: Trophy,
    checkUnlocked: (sessions) => sessions.some(s => s.status === 'completed' && s.feedback?.overallScore === 5)
  }
];

export default function AchievementsSection({ sessions }: AchievementsSectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Calculate unlock rates
  const unlockedBadges = BADGES.filter(badge => badge.checkUnlocked(sessions));
  const unlockPercentage = Math.round((unlockedBadges.length / BADGES.length) * 100);

  const handleBadgeClick = (badge: BadgeItem) => {
    setSelectedBadge(badge);
    if (badge.checkUnlocked(sessions)) {
      setIsCelebrationOpen(true);
    }
  };

  return (
    <div id="achievements-section-card" className="border border-zinc-200 rounded-3xl p-6 bg-white shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-850">
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider font-mono">
              PrepWise Milestones & Achievements
            </h4>
          </div>
          <p className="text-xs text-zinc-500">
            Earn active credential badges automatically as you complete dynamic technical assessments.
          </p>
        </div>

        {/* Progress Tracker display */}
        <div className="bg-zinc-50 border border-zinc-150 p-2.5 px-4 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">Progress Tally</span>
            <span className="text-xs font-bold font-mono text-zinc-800">
              {unlockedBadges.length} of {BADGES.length} Unlocked
            </span>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            {/* Round progress indicator circle */}
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="18" stroke="#f4f4f5" strokeWidth="3" fill="transparent" />
              <circle 
                cx="24" 
                cy="24" 
                r="18" 
                stroke="#10b981" 
                strokeWidth="3" 
                fill="transparent" 
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * unlockPercentage) / 100}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-emerald-600">
              {unlockPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar styled for quick view */}
      <div className="space-y-1.5 bg-zinc-50 p-3 rounded-2xl border border-zinc-150">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-zinc-500">
          <span>Simulation Mastery Rank</span>
          <span className="text-emerald-600">
            {unlockedBadges.length >= 5 ? 'Elite Candidate' : unlockedBadges.length >= 2 ? 'Active Contender' : 'Beginner Ready'}
          </span>
        </div>
        <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${unlockPercentage}%` }}
          />
        </div>
      </div>

      {/* Badges Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = badge.checkUnlocked(sessions);
          const BadgeIcon = badge.icon;
          
          return (
            <button
              type="button"
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer relative overflow-hidden group ${
                isUnlocked 
                  ? 'bg-linear-to-b from-white to-zinc-50 border-zinc-200 group-hover:border-zinc-300 shadow-xs' 
                  : 'bg-zinc-50/50 border-zinc-200/60 opacity-65'
              }`}
            >
              {/* Unlock Indicator Badge */}
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl border ${
                  isUnlocked ? badge.colorClass : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                }`}>
                  <BadgeIcon className="w-4.5 h-4.5" />
                </div>
                
                {isUnlocked ? (
                  <span className="text-xs shrink-0 flex items-center justify-center w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-bold">
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 font-semibold bg-zinc-100 px-1.5 py-0.5 rounded">
                    <Lock className="w-2.5 h-2.5" /> LOCK
                  </span>
                )}
              </div>

              {/* Title & Short Description */}
              <div className="space-y-1">
                <h5 className={`text-xs font-bold leading-tight font-sans ${isUnlocked ? 'text-zinc-900 font-extrabold' : 'text-zinc-500 font-medium'}`}>
                  {badge.name}
                </h5>
                <p className="text-[11px] text-zinc-400 leading-tight block truncate max-w-full">
                  {badge.description}
                </p>
              </div>

              {/* Hover Helper Action indicators */}
              <span className="text-[10px] text-zinc-400 font-mono font-semibold underline underline-offset-2 tracking-wide group-hover:text-zinc-800 transition">
                {isUnlocked ? 'Preview Credential ★' : 'View Requirements...'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Badge Interactive Dialog Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Accent light source */}
            {selectedBadge.checkUnlocked(sessions) ? (
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            ) : (
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-zinc-500/10 rounded-full blur-2xl pointer-events-none" />
            )}

            {/* Modal Title Banner */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono bg-zinc-100 text-zinc-500 font-bold px-2 py-0.5 rounded-full uppercase">
                  {selectedBadge.checkUnlocked(sessions) ? '🏆 Achievement Completed' : '🔒 Locked Milestone'}
                </span>
                <h3 className="text-base font-extrabold text-zinc-950 mt-1 z-10 relative font-display">
                  {selectedBadge.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedBadge(null); setIsCelebrationOpen(false); }}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-55/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Big graphical icon representation */}
            <div className="flex flex-col items-center justify-center py-6 bg-zinc-50 rounded-2xl border border-zinc-150 relative">
              <span className="text-4xl mb-2.5 select-none filter drop-shadow-sm animate-bounce">
                {selectedBadge.checkUnlocked(sessions) ? selectedBadge.unlockedEmoji : '🔒'}
              </span>
              <div className="text-center px-4 max-w-xs space-y-1">
                <p className="text-xs font-extrabold text-zinc-800">{selectedBadge.name}</p>
                <p className="text-[11px] text-zinc-500 italic leading-snug">{selectedBadge.description}</p>
              </div>
            </div>

            {/* Detailed Description Block */}
            <div className="space-y-3 pt-1">
              <div>
                <h6 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">Detailed Insight</h6>
                <p className="text-xs text-zinc-650 leading-relaxed mt-0.5 font-sans">
                  {selectedBadge.longDescription}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-150">
                <h6 className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  🎯 Qualification Requirement
                </h6>
                <p className="text-xs font-semibold text-zinc-805 mt-0.5 font-sans">
                  {selectedBadge.metric}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedBadge.checkUnlocked(sessions) ? 'bg-emerald-500' : 'bg-zinc-300'
                  }`} />
                  <span className="text-[10px] font-mono font-bold text-zinc-500">
                    Status: {selectedBadge.checkUnlocked(sessions) ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dismiss trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => { setSelectedBadge(null); setIsCelebrationOpen(false); }}
                className="w-full text-center text-xs font-bold bg-zinc-950 text-white py-2.5 rounded-xl hover:bg-zinc-900 transition active:scale-95 cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
