/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Sparkles, BookOpen, Clock, Layers, HelpCircle, Star, Github, RefreshCw, LogOut, Flame } from 'lucide-react';
import { InterviewSession, UserProfile, InterviewPreferences } from './types';
import Dashboard from './components/Dashboard';
import SetupScreen from './components/SetupScreen';
import SimulatorScreen from './components/SimulatorScreen';
import FeedbackReportScreen from './components/FeedbackReportScreen';
import PricingScreen from './components/PricingScreen';
import Logo from './components/Logo';
import AuthScreen from './components/AuthScreen';
import OnboardingGuide from './components/OnboardingGuide';

// Helper to provide realistic completed starting session data so the charts load beautiful immediately
const generatePrepopulatedHistory = (): InterviewSession[] => {
  return [
    {
      id: "historical-1",
      preferences: {
        type: 'Algo',
        difficulty: 'Mid-Level',
        role: 'Full Stack',
        language: 'Javascript',
        style: 'Neutral'
      },
      messages: [],
      problem: {
        title: 'Merge Intervals',
        description: 'Given an array of intervals...',
        starterCode: '',
        testCases: []
      },
      status: 'completed',
      createdAt: "2026-05-18T14:30:00Z",
      feedback: {
        overallScore: 3,
        strengths: [
          'Cleared basic logic constraints',
          'Explained functional connections clearly'
        ],
        weaknesses: [
          'High memory complexity',
          'Missed overlapping boundary condition indices'
        ],
        technicalAccuracyScore: 3,
        communicationSkillsScore: 4,
        answerQualityScore: 2,
        improvementSuggestions: [
          'Consider sorting intervals before matching overlapping items',
          'Dry run edge intervals'
        ],
        detailedSummary: '### Dynamic Performance Review\nThe candidate showed basic logic syntax but struggled with the sorted optimization constraints.'
      }
    },
    {
      id: "historical-2",
      preferences: {
        type: 'Behavioral',
        difficulty: 'Mid-Level',
        role: 'Full Stack',
        language: 'English',
        style: 'Friendly'
      },
      messages: [],
      status: 'completed',
      createdAt: "2026-05-26T10:15:00Z",
      feedback: {
        overallScore: 4,
        strengths: [
          'Strong structured situational breakdown using STAR',
          'Great conversational active communication tone'
        ],
        weaknesses: [
          'Could formulate clearer quantitative result benchmarks'
        ],
        technicalAccuracyScore: 4,
        communicationSkillsScore: 5,
        answerQualityScore: 4,
        improvementSuggestions: [
          'Focus on metric-first project milestones when describing outcome highlights.'
        ],
        detailedSummary: '### Behavioral Review\nThe candidate utilized the STAR framework beautifully. Strong display of alignment logic.'
      }
    }
  ];
};

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup' | 'simulator' | 'feedback' | 'pricing'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prepwise_authenticated') === 'true';
  });
  
  // App contexts states
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('prepwise_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (typeof parsed.streakCount === 'undefined') parsed.streakCount = 3;
          if (!parsed.role) parsed.role = 'Full Stack';
          return parsed;
        }
      } catch (e) {}
    }
    return {
      name: 'Maya',
      email: 'rahafsobh12@gmail.com',
      avatarUrl: '🚀',
      plan: 'Free',
      simulationsCompleted: 2,
      role: 'Full Stack',
      streakCount: 3
    };
  });

  const [sessions, setSessions] = useState<InterviewSession[]>(() => {
    const saved = localStorage.getItem('prepwise_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return generatePrepopulatedHistory();
  });

  const [selectedPreferences, setSelectedPreferences] = useState<InterviewPreferences | null>(null);
  const [selectedSessionForReport, setSelectedSessionForReport] = useState<InterviewSession | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Auto-open onboarding guide for authenticated first-time visitors
  useEffect(() => {
    if (isAuthenticated && localStorage.getItem('prepwise_onboarded') !== 'true') {
      setIsOnboardingOpen(true);
    }
  }, [isAuthenticated]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('prepwise_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('prepwise_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Handle launch of new session from setup preferences list
  const handleLaunchSession = (prefs: InterviewPreferences) => {
    // Check dynamic Plan limits (Page 9 pricing guidelines)
    if (profile.plan === 'Free' && sessions.filter(s => s.status === 'completed').length >= 3 && !prefs.topic) {
      // Allow Free users to complete up to 3 simulations, let them know how to upgrade
      alert("You have reached your Free Tier limit of 3 simulation sessions. Please upgrade to a Starter, Pro or Career+ plan in the Membership panel to unlock unlimited simulations!");
      setCurrentView('pricing');
      return;
    }

    if (prefs.type === 'System Design' && profile.plan === 'Free') {
      alert("System Design whiteboard modules require a 'Pro Plan' or high-tier license. Please upgrade your license tier to test complex architectures whiteboards!");
      setCurrentView('pricing');
      return;
    }

    setSelectedPreferences(prefs);
    setCurrentView('simulator');
  };

  // Handle active session feedback generation completion
  const handleFeedbackGenerated = (finishedSession: InterviewSession) => {
    setSessions(prev => [finishedSession, ...prev]);
    setProfile(prev => ({
      ...prev,
      simulationsCompleted: prev.simulationsCompleted + 1,
      streakCount: prev.streakCount + 1
    }));
    setSelectedSessionForReport(finishedSession);
    setCurrentView('feedback');
  };

  // Update profile subscription model tier
  const handleUpdatePlan = (newPlan: 'Free' | 'Starter' | 'Pro' | 'Career+') => {
    setProfile(prev => ({
      ...prev,
      plan: newPlan
    }));
  };

  const handleRetake = () => {
    setSelectedSessionForReport(null);
    setCurrentView('setup');
  };

  const handleAuthSuccess = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('prepwise_authenticated', 'true');
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('prepwise_authenticated');
  };

  if (!isAuthenticated) {
    return (
      <div id="prepwise-app-root" className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col justify-between">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <AuthScreen onAuthSuccess={handleAuthSuccess} mockProfile={profile} />
        </main>
        <footer className="border-t border-zinc-200 bg-white py-4 px-6 text-center text-[10px] text-zinc-400 select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>&copy; 2026 PrepWise AI. All simulation metrics generated in partnership with Google Gemini-3.5-flash.</p>
            <div className="flex gap-4 font-mono">
              <span>SLA Standard: Response &lt; 4s (P95)</span>
              <span>Uptime: 99.5%</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div id="prepwise-app-root" className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      
      {/* Visual Navigation Header bar */}
      <header className="bg-white border-b border-zinc-200 py-3.5 px-6 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-zinc-950 tracking-tight font-display bg-linear-to-r from-zinc-950 via-zinc-800 to-emerald-600 bg-clip-text text-transparent">PrepWise AI</h1>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Prototype</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">FAANG Simulation Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="hidden md:flex items-center gap-4 text-zinc-500">
              <span className="font-mono text-[10px] bg-zinc-150 px-2 py-0.5 rounded text-zinc-600">Local Time UTC: 2026-06-03</span>
              <span className="text-zinc-300">|</span>
              <span className="hover:text-zinc-900 cursor-pointer font-medium" onClick={() => setCurrentView('dashboard')}>Workspace Dashboard</span>
              <span className="hover:text-zinc-900 cursor-pointer font-medium" onClick={() => setCurrentView('pricing')}>Pricing Limits</span>
            </div>
            
            <div className="flex items-center gap-3 border-l border-zinc-200 pl-6">
              {/* Daily coding streak tracker widget */}
              <div 
                id="header-streak-tracker"
                title={`${profile.streakCount} consecutive practice days! Click to log extra practice day.`}
                onClick={() => {
                  setProfile(prev => ({ ...prev, streakCount: prev.streakCount + 1 }));
                  
                  // Trigger interactive feedback toast
                  const toast = document.createElement('div');
                  toast.className = 'fixed bottom-6 right-6 bg-zinc-950 text-white border border-zinc-800 text-xs font-semibold font-mono px-4.5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce';
                  toast.innerHTML = '🔥 Coding Streak Logged! +1 Practice Day';
                  document.body.appendChild(toast);
                  setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.4s ease';
                    setTimeout(() => toast.remove(), 400);
                  }, 2100);
                }}
                className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100/80 border border-orange-150 px-2.5 py-1.5 rounded-xl text-orange-700 transition cursor-pointer select-none active:scale-95 duration-150"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
                <span className="font-extrabold text-xs font-mono">{profile.streakCount || 0} Day Streak</span>
              </div>

              <button
                id="header-help-btn"
                onClick={() => setIsOnboardingOpen(true)}
                title="Interactive Playbook"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/25 text-zinc-700 hover:text-emerald-850 transition font-bold text-xs cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Tour Guide</span>
              </button>

              <div className="text-right">
                <p className="font-semibold text-zinc-805 text-[11px] font-sans">User: {profile.name}</p>
                <p className="text-[10px] text-emerald-600 font-mono font-bold uppercase">{profile.plan} Plan</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-150 border border-zinc-250 flex items-center justify-center relative shadow-xs">
                {profile.avatarUrl ? (
                  <span className="text-sm">{profile.avatarUrl}</span>
                ) : (
                  <User className="w-4 h-4 text-zinc-650" />
                )}
              </div>

              <button
                id="header-sign-out-btn"
                onClick={handleSignOut}
                title="Sign out & switch account presets"
                className="p-1 px-1.5 ml-1 rounded-lg border border-zinc-200 hover:border-red-200 hover:bg-rose-50/50 text-zinc-400 hover:text-red-650 transition cursor-pointer active:scale-90"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content viewport panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* State Route controller */}
        {currentView === 'dashboard' && (
          <Dashboard 
            pastSessions={sessions}
            profile={profile}
            onStartNew={() => setCurrentView('setup')}
            onViewReport={(session) => {
              setSelectedSessionForReport(session);
              setCurrentView('feedback');
            }}
            onOpenPricing={() => setCurrentView('pricing')}
          />
        )}

        {currentView === 'setup' && (
          <SetupScreen 
            onBack={() => setCurrentView('dashboard')}
            onLaunch={handleLaunchSession}
            userPlan={profile.plan}
          />
        )}

        {currentView === 'simulator' && selectedPreferences && (
          <SimulatorScreen 
            preferences={selectedPreferences}
            onExit={() => {
              setSelectedPreferences(null);
              setCurrentView('dashboard');
            }}
            onFeedbackGenerated={handleFeedbackGenerated}
          />
        )}

        {currentView === 'feedback' && selectedSessionForReport && (
          <FeedbackReportScreen 
            session={selectedSessionForReport}
            onClose={() => {
              setSelectedSessionForReport(null);
              setCurrentView('dashboard');
            }}
            onRetake={handleRetake}
          />
        )}

        {currentView === 'pricing' && (
          <PricingScreen 
            currentProfile={profile}
            onClose={() => setCurrentView('dashboard')}
            onUpdatePlan={handleUpdatePlan}
          />
        )}

      </main>

      {/* Footer system details */}
      <footer className="border-t border-zinc-200 bg-white py-4 px-6 text-center text-[10px] text-zinc-400 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; 2026 PrepWise AI. All simulation metrics generated in partnership with Google Gemini-3.5-flash.</p>
          <div className="flex gap-4">
            <span>SLA Standard: Response &lt; 4s (P95)</span>
            <span>Uptime: 99.5%</span>
          </div>
        </div>
      </footer>

      {/* Onboarding Guide Dialog Modal Overlay */}
      <OnboardingGuide isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />

    </div>
  );
}
