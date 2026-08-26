/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Play, Calendar, Award, Star, TrendingUp, CheckCircle, Clock, BookOpen, ChevronRight, User, Sparkles, Flame, Coffee, Lightbulb, RefreshCw, Smile } from 'lucide-react';
import { InterviewSession, UserProfile } from '../types';
import AchievementsSection from './AchievementsSection';
import TipOfTheDay from './TipOfTheDay';

interface DashboardProps {
  pastSessions: InterviewSession[];
  profile: UserProfile;
  onStartNew: () => void;
  onViewReport: (session: InterviewSession) => void;
  onOpenPricing: () => void;
}

const INTERVIEW_WISDOM = [
  { text: "Why do programmers wear glasses? Because they can't C#.", category: "Tech Humor" },
  { text: "Optimizing code before measuring is the root of all evil. Always profile first with real inputs!", category: "Performance" },
  { text: "An architect is someone who translates warm user requirements into cool microservices schemas.", category: "Architecture" },
  { text: "There are 10 types of programmers in this world: those who understand binary, and those who don't.", category: "Tech Humor" },
  { text: "In a system design interview, explaining alternative trade-offs gets you double the score of just naming products.", category: "Strategy" },
  { text: "If you're stuck on an array problem, think: is there a sliding window or hash map setup that optimizes to O(N)?", category: "Algorithm Tip" },
  { text: "A senior developer reads code 10x more than they write it. Keep it simple, testable, and cleanly structured.", category: "Pro Philosophy" }
];

const ADRENALINE_VIBES = [
  { level: 1, name: "Zen Master 🧘‍♂️", desc: "No stress. Slow, highly analytical flow.", bonus: "Suggested style: Friendly" },
  { level: 2, name: "Fully Hydrated 💧", desc: "Focused, responsive, clear mental states.", bonus: "Suggested style: Neutral" },
  { level: 3, name: "Coffee Fueled ☕", desc: "Ideal performance spike with optimized speed.", bonus: "Suggested style: Challenging" },
  { level: 4, name: "Double Espresso ⚡", desc: "Hyperactive thought process & raw adrenaline.", bonus: "Suggested style: Strict" },
  { level: 5, name: "Production Down Mode 🚨", desc: "Maximum alerts. Ultra speed, pure whiteboard chaos!", bonus: "Suggested style: Challenging" }
];

export default function Dashboard({ pastSessions, profile, onStartNew, onViewReport, onOpenPricing }: DashboardProps) {
  const [activeTab, setActiveTab ] = useState<'overview' | 'sessions'>('overview');
  const [fortuneIndex, setFortuneIndex] = useState(0);
  const [isFortuneRolling, setIsFortuneRolling] = useState(false);
  const [adrenalineLevel, setAdrenalineLevel] = useState(3);

  const rollFortune = () => {
    setIsFortuneRolling(true);
    setTimeout(() => {
      setFortuneIndex((prev) => (prev + 1) % INTERVIEW_WISDOM.length);
      setIsFortuneRolling(false);
    }, 600);
  };

  // Calculate stats
  const totalCompleted = pastSessions.filter(s => s.status === 'completed').length;

  const unlockedBadgesCount = [
    pastSessions.some(s => s.preferences.type === 'Algo' && s.status === 'completed'),
    pastSessions.some(s => s.preferences.type === 'Behavioral' && s.status === 'completed'),
    pastSessions.some(s => s.preferences.type === 'System Design' && s.status === 'completed'),
    pastSessions.some(s => s.status === 'completed' && (s.preferences.style === 'Strict' || s.preferences.style === 'Challenging')),
    pastSessions.filter(s => s.status === 'completed').length >= 3,
    pastSessions.some(s => s.status === 'completed' && s.feedback?.overallScore === 5)
  ].filter(Boolean).length;
  
  const completedSessions = pastSessions.filter(s => s.status === 'completed' && s.feedback);
  
  const avgOverall = completedSessions.length 
    ? (completedSessions.reduce((sum, s) => sum + (s.feedback?.overallScore || 0), 0) / completedSessions.length).toFixed(1)
    : 'N/A';

  const avgTechnical = completedSessions.length
    ? (completedSessions.reduce((sum, s) => sum + (s.feedback?.technicalAccuracyScore || 0), 0) / completedSessions.length).toFixed(1)
    : 'N/A';

  const avgCommunication = completedSessions.length
    ? (completedSessions.reduce((sum, s) => sum + (s.feedback?.communicationSkillsScore || 0), 0) / completedSessions.length).toFixed(1)
    : 'N/A';

  const avgQuality = completedSessions.length
    ? (completedSessions.reduce((sum, s) => sum + (s.feedback?.answerQualityScore || 0), 0) / completedSessions.length).toFixed(1)
    : 'N/A';

  // Topic frequency mapping
  const roleRecomendations = {
    Frontend: ['React 19 Rendering & Concurrent Mode', 'CSS Container Queries & Responsive Design', 'Debouncing/Throttling implementations', 'State Managers & Cache optimizations'],
    Backend: ['Distributed Database Sharding', 'Message Queues (Kafka vs RabbitMQ)', 'Redis Caching policies', 'Concurrency & Lock management'],
    'Full Stack': ['GraphQL APIs & Schema federation', 'Next.js Server Actions & SSR caching', 'JWT and OAuth flows security', 'Full-text Search engine integration'],
    Mobile: ['Offline Synchronization sync rules', 'Memory footprints and battery optimizations', 'Push notification payloads', 'Local relational storage (SQLite/Room)'],
    DevOps: ['Kubernetes ingress routing configs', 'CI/CD pipeline caches', 'Terraform State Management', 'Microservices telemetry alerts'],
    'System Architect': ['CAP Theorem trade-offs in distributed systems', 'Consistent Hashing mechanisms', 'Event sourcing and CQRS patterns', 'Global load-balancing latency constraints']
  };

  const currentRecommend = roleRecomendations[profile.role as keyof typeof roleRecomendations] || roleRecomendations['Full Stack'];

  // Render SVG Sparkline
  const renderSVGProgress = () => {
    if (completedSessions.length < 2) {
      return (
        <div id="no-history-chart" className="h-48 flex items-center justify-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 p-6 text-center">
          <div>
            <TrendingUp className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-600">Simulate 2 or more interviews to unlock your visual trend graph</p>
            <p className="text-xs text-zinc-400 mt-1">Track your progress rating progression with real AI reports</p>
          </div>
        </div>
      );
    }

    const width = 500;
    const height = 160;
    const padding = 24;
    const points = completedSessions.map((session, index) => {
      const score = session.feedback?.overallScore || 0;
      const x = padding + (index * (width - padding * 2)) / (completedSessions.length - 1);
      const y = height - padding - ((score - 1) * (height - padding * 2)) / 4; // 1 to 5 scale
      return { x, y, score, date: new Date(session.createdAt).toLocaleDateString() };
    });

    const pathData = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div id="progress-trend-chart" className="border border-zinc-150 rounded-2xl p-5 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-zinc-800 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Overall Score Progression Trend (1-5 Scale)
          </h4>
          <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">{completedSessions.length} points</span>
        </div>
        
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[400px] h-auto">
            {/* Horizontal Grid lines */}
            {[1, 2, 3, 4, 5].map((gridVal) => {
              const y = height - padding - ((gridVal - 1) * (height - padding * 2)) / 4;
              return (
                <g key={gridVal}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                  <text x={padding - 10} y={y + 4} className="text-[10px] font-mono fill-zinc-400" textAnchor="end">{gridVal}</text>
                </g>
              );
            })}
            
            {/* The trend line */}
            <path d={pathData} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Points */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" className="fill-white stroke-emerald-500 stroke-2 hover:r-7 transition-all" />
                <title>{`Score: ${p.score} (${p.date})`}</title>
              </g>
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 px-6 mt-1">
          <span>First Session</span>
          <span>Latest Session</span>
        </div>
      </div>
    );
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Top Welcome Card */}
      <div className="bg-radial from-neutral-900 to-black rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-zinc-800">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-zinc-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-emerald-400 text-xs font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Developer AI Preparation Environment</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">
              Welcome back, {profile.name || "Software Developer"}
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Elevate your algorithm clarity, whiteboard system designs, and behavioral STAR alignment in full interactive simulation loops.
            </p>
          </div>
          
          <button
            id="start-interview-btn"
            onClick={onStartNew}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-zinc-950 font-medium hover:bg-zinc-100 transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-zinc-950 stroke-zinc-950" />
            <span>Start AI Simulation</span>
          </button>
        </div>

        {/* Plan display inside Header */}
        <div className="border-t border-zinc-800/80 mt-6 pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Current License Model</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-400">{profile.plan} Plan</span>
                <button 
                  id="upgrade-trigger-btn"
                  onClick={onOpenPricing} 
                  className="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 px-2 py-0.5 rounded text-zinc-300 font-medium transition cursor-pointer"
                >
                  Manage Membership
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6">
            <div className="text-left">
              <p className="text-xs text-zinc-400 font-mono">SIMULATION RUNS</p>
              <p className="text-sm md:text-lg font-semibold font-mono text-zinc-100">{totalCompleted} Complete</p>
            </div>
            <div className="text-left border-l border-zinc-805 pl-4 md:pl-6">
              <p className="text-xs text-zinc-400 font-mono">AVG OVERALL SCORE</p>
              <div className="flex items-center gap-1">
                <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                <span className="text-sm md:text-lg font-semibold font-mono text-zinc-100">{avgOverall} / 5.0</span>
              </div>
            </div>
            <div className="text-left border-l border-zinc-805 pl-4 md:pl-6">
              <p className="text-xs text-zinc-400 font-mono">BADGES EARNED</p>
              <div className="flex items-center gap-1">
                <Award className="w-4.5 h-4.5 text-emerald-400" />
                <span className="text-sm md:text-lg font-semibold font-mono text-zinc-100">{unlockedBadgesCount} / 6</span>
              </div>
            </div>
            <div className="text-left border-l border-zinc-805 pl-4 md:pl-6 font-semibold">
              <p className="text-xs text-zinc-400 font-mono">DAILY STREAK</p>
              <div className="flex items-center gap-1">
                <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-sm md:text-lg font-semibold font-mono text-zinc-100">{profile.streakCount || 0} Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns Dashboard Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub Navigation */}
          <div className="flex border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'border-neutral-950 text-neutral-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              } mr-6`}
            >
              System Performance Overview
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'sessions' 
                  ? 'border-neutral-950 text-neutral-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Simulation Logs ({pastSessions.length})
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Scoring Metrices grids */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50/20">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase font-mono text-zinc-500">Technical Accuracy</span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded font-medium">{avgTechnical !== 'N/A' ? 'Evaluated' : 'Pending'}</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-zinc-900 mt-2">{avgTechnical !== 'N/A' ? `${avgTechnical}` : '--'}<span className="text-sm font-normal text-zinc-400">/5</span></p>
                  <p className="text-xs text-zinc-400 mt-1">Algorithm structure, code syntax, architectural trade-offs.</p>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50/20">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase font-mono text-zinc-500">Communication Skills</span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded font-medium">{avgCommunication !== 'N/A' ? 'Evaluated' : 'Pending'}</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-zinc-900 mt-2">{avgCommunication !== 'N/A' ? `${avgCommunication}` : '--'}<span className="text-sm font-normal text-zinc-400">/5</span></p>
                  <p className="text-xs text-zinc-400 mt-1">Verbal clarity, systematic breakdown, active questioning.</p>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50/20">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase font-mono text-zinc-500">Answer Quality</span>
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded font-medium">{avgQuality !== 'N/A' ? 'Evaluated' : 'Pending'}</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-zinc-900 mt-2">{avgQuality !== 'N/A' ? `${avgQuality}` : '--'}<span className="text-sm font-normal text-zinc-400">/5</span></p>
                  <p className="text-xs text-zinc-400 mt-1">Omission checks, optimization depth, edge-case validation.</p>
                </div>
              </div>

              {/* Progress Trend Graph */}
              {renderSVGProgress()}

              {/* Achievements Section */}
              <AchievementsSection sessions={pastSessions} />
              
              {/* Feature info boxes alignment with the PRD */}
              <div className="border border-zinc-200 rounded-2xl p-5 bg-white space-y-4">
                <h4 className="text-sm font-semibold text-zinc-900">Your Adaptive Training Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Target Role Optimized</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">PrepWise AI dynamically aligns complexity based on your selected "{profile.role}" role.</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Mocking Non-JS execution</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Use Python or C++ to write solutions. PrepWise runs a beautiful AST parser simulation to assess test correctness!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {pastSessions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-800">No session logs found</p>
                  <p className="text-xs text-zinc-400 mt-1">Start a new simulation to generate real-time logs and AI reviews.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-150 border border-zinc-200 rounded-2xl overflow-hidden bg-white">
                  {pastSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-55/10 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                            {session.preferences.type}
                          </span>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(session.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-800">
                          {session.preferences.role} &bull; {session.preferences.difficulty} Difficulty
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Interviewer: <span className="font-medium text-zinc-700">{session.preferences.style} personality</span> &bull; {session.preferences.language} language
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {session.feedback ? (
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-[10px] text-zinc-400 font-medium">AI SCORE</p>
                              <div className="flex items-center gap-0.5 justify-end">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold font-mono text-zinc-900">{session.feedback.overallScore}/5</span>
                              </div>
                            </div>
                            <button
                              id={`view-report-${session.id}`}
                              onClick={() => onViewReport(session)}
                              className="inline-flex items-center gap-1 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 px-3 py-2 rounded-xl transition cursor-pointer"
                            >
                              <span>Report</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Active / Incomplete
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right 1 Column Sidebar Panels */}
        <div className="space-y-6">
          
          {/* Interactive Feature 1: Developer Focus & Vibe Adjuster */}
          <div id="vibe-adjuster-panel" className="border border-zinc-200 rounded-3xl p-5 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                Interviewer Vibe Adjuster
              </h4>
              <span className="text-[10px] bg-red-50 text-red-650 font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Interactive</span>
            </div>
            
            <p className="text-xs text-zinc-500">
              Pick your present mental state or confidence level to preview simulated performance calibration.
            </p>

            <div className="space-y-3">
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={adrenalineLevel}
                onChange={(e) => setAdrenalineLevel(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-150 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-150 space-y-1.5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">
                    {ADRENALINE_VIBES[adrenalineLevel - 1].name}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 font-semibold bg-zinc-200 px-1.5 py-0.5 rounded">
                    Level {adrenalineLevel}/5
                  </span>
                </div>
                <p className="text-xs text-zinc-500 italic">
                  &ldquo;{ADRENALINE_VIBES[adrenalineLevel - 1].desc}&rdquo;
                </p>
                <div className="text-[10px] text-emerald-600 font-bold font-mono">
                  💡 {ADRENALINE_VIBES[adrenalineLevel - 1].bonus}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Feature 2: Weekly Coding Boost & Wisdom Cookie */}
          <div id="wisdom-cookie-panel" className="border border-zinc-200 rounded-3xl p-5 bg-linear-to-b from-zinc-50/50 to-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                AI Interview Wisdom Cookie
              </h4>
              <button 
                id="roll-fortune-btn"
                onClick={rollFortune}
                disabled={isFortuneRolling}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition active:scale-90 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFortuneRolling ? 'animate-spin text-emerald-500' : ''}`} />
              </button>
            </div>

            <div className="min-h-[80px] flex flex-col justify-center bg-white p-4 rounded-2xl border border-zinc-200 relative overflow-hidden group">
              <div className="absolute right-0 top-0 -mt-1 -mr-1 w-6 h-6 bg-amber-100 rounded-bl-xl flex items-center justify-center text-[10px] text-amber-800 font-bold group-hover:scale-110 transition">
                ★
              </div>
              
              <span className="text-[9px] font-mono bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-full w-max mb-2">
                {INTERVIEW_WISDOM[fortuneIndex].category}
              </span>
              
              <p className={`text-xs text-zinc-700 font-medium leading-relaxed transition-all duration-300 ${isFortuneRolling ? 'opacity-40 translate-x-2 blur-xs' : 'opacity-100 translate-x-0 blur-none'}`}>
                {INTERVIEW_WISDOM[fortuneIndex].text}
              </p>
            </div>

            <button 
              id="click-roll-fortune-btn"
              onClick={rollFortune}
              disabled={isFortuneRolling}
              className="w-full text-center text-[11px] font-semibold text-zinc-900 border border-zinc-200 py-2 rounded-xl bg-white hover:bg-zinc-50 hover:border-zinc-300 transition active:scale-95 cursor-pointer"
            >
              {isFortuneRolling ? 'Cracking cookie...' : 'Crack Another Wisdom Cookie! ✨'}
            </button>
          </div>

          {/* Quick Learning Roadmaps Recommendation tailored based on Selected Role */}
          <div className="border border-zinc-200 rounded-3xl p-5 bg-white shadow-xs">
            <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Custom Learning Path for {profile.role}
            </h4>
            <p className="text-xs text-zinc-400 mt-1">Based on global FAANG tracking metrics and modern stack requirements.</p>
            
            <div className="mt-4 space-y-3">
              {currentRecommend.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 bg-zinc-50/20 p-3 rounded-xl border border-zinc-150 card-hover-fun">
                  <span className="w-5 h-5 rounded-md bg-zinc-900 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-800">{item}</p>
                    <span className="text-[9px] text-emerald-600 font-mono tracking-wider font-semibold uppercase mt-1 inline-block">Adaptive Goal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing simulation callout in right rail */}
          <div className="border border-zinc-200 rounded-3xl p-6 bg-zinc-950 text-white relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">MEMBERSHIP ACCESS</span>
            </div>
            
            <h4 className="text-sm font-bold text-zinc-100">Simulated Subscription Billing</h4>
            <p className="text-xs text-zinc-400 mt-1">Experience limit controls across Free ($0), Starter ($9.99), Pro ($24.99), and Career+ ($49.99) plans dynamically.</p>
            
            <button
              id="dashboard-pricing-btn"
              onClick={onOpenPricing}
              className="mt-4 block w-full text-center text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-100 transition duration-200 px-4 py-3 rounded-2xl cursor-pointer"
            >
              Examine Membership Levels
            </button>
          </div>

          {/* SLA commitments display based on PRD page 7/8 */}
          <div className="border border-zinc-150 rounded-2xl p-4 bg-white space-y-2">
            <h5 className="text-[11px] font-mono font-bold text-zinc-400 tracking-wider">PREPWISE SLA PROMISE</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">First Question Load</span>
                <span className="font-mono text-zinc-800 font-semibold">&lt; 2s (P95)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium font-sans">AI Response Latency</span>
                <span className="font-mono text-zinc-800 font-semibold">&lt; 4s (P95)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Report Compilation</span>
                <span className="font-mono text-zinc-800 font-semibold">&lt; 30s (P95)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interview Tip of the Day live overlay widget */}
      <TipOfTheDay />

    </div>
  );
}
