import { test, expect } from '@playwright/test';
import { dismissOnboardingIfVisible, loginViaGithubShortcut } from './helpers/auth';

test.describe('Authentication flow', () => {
  test('signs in via GitHub OAuth shortcut and reaches dashboard', async ({ page }) => {
    await loginViaGithubShortcut(page);

    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back, Maya' })).toBeVisible();
    await expect(page.locator('#start-interview-btn')).toBeEnabled();
  });

  test('shows onboarding guide on first login and can skip it', async ({ page }) => {
    await page.goto('/');
    await page.locator('#auth-screen-root').waitFor();

    await page.getByRole('button', { name: /GitHub OAuth/i }).click();
    await page.locator('#onboarding-guide-overlay').waitFor({ state: 'visible' });

    await expect(page.getByText(/Pick Your Track/i)).toBeVisible();
    await page.locator('#onboarding-skip-top-btn').click();
    await expect(page.locator('#onboarding-guide-overlay')).toBeHidden();
    await expect(page.locator('#dashboard-view')).toBeVisible();
  });

  test('signs out and returns to auth screen', async ({ page }) => {
    await loginViaGithubShortcut(page);
    await dismissOnboardingIfVisible(page);

    await page.locator('#header-sign-out-btn').click();
    await expect(page.locator('#auth-screen-root')).toBeVisible();
  });
});
