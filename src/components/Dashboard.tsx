import { motion } from 'motion/react';
import { Play, TrendingUp, Star, Clock, ChevronRight, Flame, Target } from 'lucide-react';
import { InterviewSession, UserProfile } from '../types';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';

interface DashboardProps {
  pastSessions: InterviewSession[];
  profile: UserProfile;
  onStartNew: () => void;
  onViewReport: (session: InterviewSession) => void;
  onOpenPricing: () => void;
}

const ROLE_FOCUS: Record<string, string[]> = {
  Frontend: ['React concurrent rendering', 'CSS container queries', 'State management patterns'],
  Backend: ['Database sharding', 'Message queue design', 'Caching strategies'],
  'Full Stack': ['GraphQL federation', 'SSR caching', 'Auth flow security'],
  Mobile: ['Offline sync', 'Memory optimization', 'Push notification design'],
  DevOps: ['Kubernetes ingress', 'CI/CD pipelines', 'Infrastructure as code'],
  'System Architect': ['CAP theorem trade-offs', 'Event sourcing', 'Global load balancing'],
};

export default function Dashboard({ pastSessions, profile, onStartNew, onViewReport }: DashboardProps) {
  const completed = pastSessions.filter((s) => s.status === 'completed' && s.feedback);
  const thisWeek = completed.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  const avgScore = completed.length
    ? (completed.reduce((sum, s) => sum + (s.feedback?.overallScore ?? 0), 0) / completed.length).toFixed(1)
    : '--';

  const categoryAvgs = {
    technical: completed.length
      ? (completed.reduce((s, x) => s + (x.feedback?.technicalAccuracyScore ?? 0), 0) / completed.length).toFixed(1)
      : '--',
    communication: completed.length
      ? (completed.reduce((s, x) => s + (x.feedback?.communicationSkillsScore ?? 0), 0) / completed.length).toFixed(1)
      : '--',
    quality: completed.length
      ? (completed.reduce((s, x) => s + (x.feedback?.answerQualityScore ?? 0), 0) / completed.length).toFixed(1)
      : '--',
  };

  const bestCategory = (() => {
    const scores = [
      { name: 'Technical', val: parseFloat(categoryAvgs.technical as string) || 0 },
      { name: 'Communication', val: parseFloat(categoryAvgs.communication as string) || 0 },
      { name: 'Problem Solving', val: parseFloat(categoryAvgs.quality as string) || 0 },
    ];
    return scores.sort((a, b) => b.val - a.val)[0]?.name ?? 'N/A';
  })();

  const focusAreas = ROLE_FOCUS[profile.role] ?? ROLE_FOCUS['Full Stack'];

  const renderChart = () => {
    if (completed.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-secondary)]">Complete 2+ sessions to unlock score trends</p>
          </div>
        </div>
      );
    }

    const w = 480;
    const h = 140;
    const pad = 24;
    const pts = completed.slice().reverse().map((session, i) => {
      const score = session.feedback?.overallScore ?? 0;
      const x = pad + (i * (w - pad * 2)) / (completed.length - 1);
      const y = h - pad - ((score - 1) * (h - pad * 2)) / 4;
      return { x, y, score };
    });
    const path = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        {[1, 2, 3, 4, 5].map((v) => {
          const y = h - pad - ((v - 1) * (h - pad * 2)) / 4;
          return (
            <g key={v}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4,4" />
              <text x={pad - 8} y={y + 4} className="text-[10px] fill-[var(--color-text-muted)] font-mono" textAnchor="end">{v}</text>
            </g>
          );
        })}
        <path d={path} fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6C63FF" stroke="var(--color-bg-surface)" strokeWidth="2" />
        ))}
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-[var(--color-warning)]" />
            <span className="text-xs font-mono text-[var(--color-warning)]">{profile.streakCount} day streak</span>
          </div>
          <h2 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight">
            Welcome back, {profile.name}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {profile.role} track · {profile.plan} plan
          </p>
        </div>
        <Button variant="primary" icon={Play} onClick={onStartNew}>
          New Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Sessions this week', value: thisWeek, icon: Clock },
          { label: 'Average score', value: avgScore !== '--' ? `${avgScore}/5` : '--', icon: Star },
          { label: 'Best category', value: bestCategory, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }, i) => (
          <div key={label}>
          <Card delay={i * 0.07} hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-mono">{label}</p>
                <p className="text-[28px] font-bold text-[var(--color-text-primary)] mt-1">{value}</p>
              </div>
              <Icon className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
          </Card>
          </div>
        ))}
      </div>

      <Card hover={false}>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
          Score over time
        </h3>
        {renderChart()}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Recent sessions</h3>
            {pastSessions.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No sessions yet. Start your first interview.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {pastSessions.slice(0, 8).map((session) => (
                  <div key={session.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={session.preferences.type} />
                        <Badge variant={session.preferences.difficulty} />
                      </div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {session.preferences.role} · {session.preferences.style} style
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {session.feedback && (
                        <span className="text-sm font-bold font-mono text-[var(--color-text-primary)]">
                          {session.feedback.overallScore}/5
                        </span>
                      )}
                      {session.feedback && (
                        <button
                          onClick={() => onViewReport(session)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:brightness-110 transition cursor-pointer"
                        >
                          Report <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card hover={false}>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--color-accent-alt)]" />
            Recommended focus
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">Based on your {profile.role} track</p>
          <ul className="space-y-2">
            {focusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-accent)] font-mono text-xs mt-0.5">{i + 1}.</span>
                {area}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </motion.div>
  );
}
