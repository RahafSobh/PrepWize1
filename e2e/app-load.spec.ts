import { test, expect } from '@playwright/test';
import { seedAuthenticatedUser } from './helpers/auth';

test.describe('App load', () => {
  test('loads unauthenticated and shows the landing page', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#landing-page')).toBeVisible();
    await expect(page.locator('#prepwise-app-root')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Prepare Smarter. Interview Better.' })).toBeVisible();

    await page.locator('#start-practicing-btn').click();
    await expect(page.locator('#auth-screen-root')).toBeVisible();
  });

  test('loads authenticated dashboard when session cookie is set', async ({ page }) => {
    await seedAuthenticatedUser(page, { onboarded: true });

    await page.goto('/');

    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.locator('#start-interview-btn')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back, E2E User' })).toBeVisible();
  });
});
