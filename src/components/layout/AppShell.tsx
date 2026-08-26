import type { ReactNode } from 'react';
import { Code2, LayoutDashboard, TrendingUp, CreditCard, LucideIcon } from 'lucide-react';
import Logo from '../Logo';

export type AppView = 'home' | 'dashboard' | 'setup' | 'simulator' | 'feedback' | 'pricing';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  profileName?: string;
  plan?: string;
  streakCount?: number;
  children: ReactNode;
  showSidebar?: boolean;
  headerActions?: ReactNode;
}

const NAV_ITEMS: { view: AppView; label: string; icon: LucideIcon }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'setup', label: 'New Interview', icon: Code2 },
  { view: 'pricing', label: 'Pricing', icon: CreditCard },
];

export default function AppShell({
  currentView,
  onNavigate,
  profileName,
  plan,
  streakCount = 0,
  children,
  showSidebar = true,
  headerActions,
}: AppShellProps) {
  const isInterviewRoom = currentView === 'simulator';

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex">
      {showSidebar && (
        <aside className="w-[240px] shrink-0 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] flex flex-col fixed top-0 left-0 h-full z-30">
          <div className="p-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <h1 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">
                  PrepWise AI
                </h1>
                <p className="text-[10px] text-[var(--color-text-muted)] font-mono">Interview Simulator</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
              <button
                key={view}
                onClick={() => onNavigate(view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors cursor-pointer ${
                  currentView === view
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[rgba(108,99,255,0.3)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {profileName && (
            <div className="p-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-bg-hover)] border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-[var(--color-accent)]">
                  {profileName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{profileName}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{plan} Plan</p>
                </div>
              </div>
              {streakCount > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[var(--color-warning)] font-mono">
                  <TrendingUp className="w-3 h-3" />
                  {streakCount} day streak
                </div>
              )}
            </div>
          )}
        </aside>
      )}

      <div className={`flex-1 flex flex-col min-h-screen ${showSidebar ? 'ml-[240px]' : ''}`}>
        {!isInterviewRoom && (
          <header className="h-14 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-base)] sticky top-0 z-20 flex items-center justify-between px-6">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {currentView === 'dashboard' && 'Progress & Analytics'}
              {currentView === 'setup' && 'Interview Setup'}
              {currentView === 'feedback' && 'Session Report'}
              {currentView === 'pricing' && 'Membership Plans'}
              {currentView === 'home' && 'PrepWise AI'}
            </div>
            {headerActions}
          </header>
        )}

        <main className={`flex-1 ${isInterviewRoom ? '' : 'p-6 max-w-[1200px] w-full mx-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
