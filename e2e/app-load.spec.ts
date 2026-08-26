import { test, expect } from '@playwright/test';

test.describe('App load', () => {
  test('loads unauthenticated and shows auth screen', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#auth-screen-root')).toBeVisible();
    await expect(page.locator('#prepwise-app-root')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Get Started with PrepWise AI|Welcome back/i })).toBeVisible();
  });

  test('loads authenticated dashboard when localStorage is seeded', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('prepwise_authenticated', 'true');
      localStorage.setItem('prepwise_onboarded', 'true');
      localStorage.setItem(
        'prepwise_profile',
        JSON.stringify({
          name: 'E2E User',
          email: 'e2e@prepwize.test',
          avatarUrl: '🚀',
          plan: 'Free',
          simulationsCompleted: 0,
          role: 'Full Stack',
          streakCount: 1,
        }),
      );
      localStorage.setItem('prepwise_sessions', JSON.stringify([]));
    });

    await page.goto('/');

    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.locator('#start-interview-btn')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back, E2E User' })).toBeVisible();
  });
});
