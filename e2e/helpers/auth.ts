import { Page } from '@playwright/test';

export interface AuthenticatedUserOptions {
  plan?: 'Free' | 'Starter' | 'Pro' | 'Career+';
  completedSessions?: number;
  onboarded?: boolean;
}

const DEFAULT_PROFILE = {
  name: 'E2E User',
  email: 'e2e@prepwize.test',
  avatarUrl: '🚀',
  plan: 'Free' as const,
  simulationsCompleted: 0,
  role: 'Full Stack' as const,
  streakCount: 1,
};

/** Issue a server-side demo session cookie + seed local profile data. */
export async function seedAuthenticatedUser(
  page: Page,
  options: AuthenticatedUserOptions = {},
) {
  const profile = {
    ...DEFAULT_PROFILE,
    plan: options.plan ?? DEFAULT_PROFILE.plan,
    simulationsCompleted: options.completedSessions ?? 0,
  };

  const demoRes = await page.request.post('/api/auth/demo', {
    data: { name: profile.name, email: profile.email },
  });

  if (!demoRes.ok()) {
    throw new Error(`Demo auth failed (${demoRes.status()}): ${await demoRes.text()}`);
  }

  await page.addInitScript(
    ({ profileValue, onboarded }) => {
      localStorage.setItem('prepwise_profile', JSON.stringify(profileValue));
      localStorage.setItem('prepwise_sessions', JSON.stringify([]));
      if (onboarded) {
        localStorage.setItem('prepwise_onboarded', 'true');
      }
    },
    { profileValue: profile, onboarded: options.onboarded ?? true },
  );
}

export async function gotoDashboard(page: Page, options?: AuthenticatedUserOptions) {
  await seedAuthenticatedUser(page, options);
  await page.goto('/');
  await page.locator('#dashboard-view').waitFor({ state: 'visible' });
}

export async function dismissOnboardingIfVisible(page: Page) {
  const overlay = page.locator('#onboarding-guide-overlay');
  if (await overlay.isVisible().catch(() => false)) {
    await page.locator('#onboarding-skip-top-btn').click();
    await overlay.waitFor({ state: 'hidden' });
  }
}

/** Demo auth via GitHub shortcut button (development only). */
export async function loginViaGithubShortcut(page: Page) {
  await page.goto('/');
  await page.locator('#auth-screen-root').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: /GitHub OAuth/i }).click();
  await page.locator('#dashboard-view').waitFor({ state: 'visible' });
  await dismissOnboardingIfVisible(page);
}
