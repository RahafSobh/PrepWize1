import { useState, useEffect } from 'react';
import { LogOut, HelpCircle } from 'lucide-react';
import { InterviewSession, UserProfile, InterviewPreferences } from './types';
import AppShell, { AppView } from './components/layout/AppShell';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SetupScreen from './components/SetupScreen';
import SimulatorScreen from './components/SimulatorScreen';
import FeedbackReportScreen from './components/FeedbackReportScreen';
import PricingScreen from './components/PricingScreen';
import AuthScreen from './components/AuthScreen';
import Button from './components/ui/Button';

const generatePrepopulatedHistory = (): InterviewSession[] => [
  {
    id: 'historical-1',
    preferences: { type: 'Algo', difficulty: 'Mid-Level', role: 'Full Stack', language: 'Javascript', style: 'Neutral' },
    messages: [],
    problem: { title: 'Merge Intervals', description: 'Given an array of intervals...', starterCode: '', testCases: [] },
    status: 'completed',
    createdAt: '2026-05-18T14:30:00Z',
    feedback: {
      overallScore: 3,
      strengths: ['Clear logic flow', 'Good verbal explanation'],
      weaknesses: ['High memory usage', 'Missed edge case on empty input'],
      technicalAccuracyScore: 3,
      communicationSkillsScore: 4,
      answerQualityScore: 3,
      improvementSuggestions: ['Sort intervals before merging', 'Dry-run with empty arrays'],
      detailedSummary: 'Solid fundamentals with room to optimize.',
    },
  },
  {
    id: 'historical-2',
    preferences: { type: 'Behavioral', difficulty: 'Mid-Level', role: 'Full Stack', language: 'English', style: 'Friendly' },
    messages: [],
    status: 'completed',
    createdAt: '2026-05-26T10:15:00Z',
    feedback: {
      overallScore: 4,
      strengths: ['Strong STAR structure', 'Clear communication tone'],
      weaknesses: ['Could add more quantitative results'],
      technicalAccuracyScore: 4,
      communicationSkillsScore: 5,
      answerQualityScore: 4,
      improvementSuggestions: ['Lead with metrics when describing outcomes'],
      detailedSummary: 'Excellent behavioral performance.',
    },
  },
];

export default function App() {
  const [authMode, setAuthMode] = useState<'landing' | 'auth'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('prepwise_authenticated') === 'true');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('prepwise_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return { streakCount: 3, role: 'Full Stack', ...parsed };
      } catch { /* ignore */ }
    }
    return { name: 'Maya', email: 'dev@example.com', avatarUrl: '', plan: 'Free', simulationsCompleted: 2, role: 'Full Stack', streakCount: 3 };
  });

  const [sessions, setSessions] = useState<InterviewSession[]>(() => {
    const saved = localStorage.getItem('prepwise_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return generatePrepopulatedHistory();
  });

  const [selectedPreferences, setSelectedPreferences] = useState<InterviewPreferences | null>(null);
  const [selectedSessionForReport, setSelectedSessionForReport] = useState<InterviewSession | null>(null);

  useEffect(() => { localStorage.setItem('prepwise_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('prepwise_sessions', JSON.stringify(sessions)); }, [sessions]);

  const handleLaunchSession = (prefs: InterviewPreferences) => {
    if (profile.plan === 'Free' && sessions.filter((s) => s.status === 'completed').length >= 3 && !prefs.topic) {
      alert('Free tier limit reached (3 sessions). Upgrade to continue.');
      setCurrentView('pricing');
      return;
    }
    if (prefs.type === 'System Design' && profile.plan === 'Free') {
      alert('System Design requires Pro plan.');
      setCurrentView('pricing');
      return;
    }
    setSelectedPreferences(prefs);
    setCurrentView('simulator');
  };

  const handleFeedbackGenerated = (finishedSession: InterviewSession) => {
    setSessions((prev) => [finishedSession, ...prev]);
    setProfile((prev) => ({ ...prev, simulationsCompleted: prev.simulationsCompleted + 1, streakCount: prev.streakCount + 1 }));
    setSelectedSessionForReport(finishedSession);
    setCurrentView('feedback');
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
    setAuthMode('landing');
  };

  if (!isAuthenticated) {
    if (authMode === 'auth') {
      return (
        <AuthScreen
          onAuthSuccess={handleAuthSuccess}
          mockProfile={profile}
          onBack={() => setAuthMode('landing')}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setAuthMode('auth')}
        onSignIn={() => setAuthMode('auth')}
      />
    );
  }

  const isSimulator = currentView === 'simulator';

  if (isSimulator && selectedPreferences) {
    return (
      <SimulatorScreen
        preferences={selectedPreferences}
        onExit={() => { setSelectedPreferences(null); setCurrentView('dashboard'); }}
        onFeedbackGenerated={handleFeedbackGenerated}
      />
    );
  }

  return (
    <AppShell
      currentView={currentView}
      onNavigate={setCurrentView}
      profileName={profile.name}
      plan={profile.plan}
      streakCount={profile.streakCount}
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={HelpCircle}>Help</Button>
          <Button variant="ghost" icon={LogOut} onClick={handleSignOut}>Sign out</Button>
        </div>
      }
    >
      {currentView === 'dashboard' && (
        <Dashboard
          pastSessions={sessions}
          profile={profile}
          onStartNew={() => setCurrentView('setup')}
          onViewReport={(s) => { setSelectedSessionForReport(s); setCurrentView('feedback'); }}
          onOpenPricing={() => setCurrentView('pricing')}
        />
      )}
      {currentView === 'setup' && (
        <SetupScreen onBack={() => setCurrentView('dashboard')} onLaunch={handleLaunchSession} userPlan={profile.plan} />
      )}
      {currentView === 'feedback' && selectedSessionForReport && (
        <FeedbackReportScreen
          session={selectedSessionForReport}
          onClose={() => { setSelectedSessionForReport(null); setCurrentView('dashboard'); }}
          onRetake={() => { setSelectedSessionForReport(null); setCurrentView('setup'); }}
        />
      )}
      {currentView === 'pricing' && (
        <PricingScreen
          currentProfile={profile}
          onClose={() => setCurrentView('dashboard')}
          onUpdatePlan={(plan) => setProfile((prev) => ({ ...prev, plan }))}
        />
      )}
    </AppShell>
  );
}
