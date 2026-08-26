import { test, expect } from '@playwright/test';
import { gotoDashboard } from './helpers/auth';

/**
 * Smoke tests hit the real Express server without Playwright route mocks.
 * With an empty GEMINI_API_KEY the server uses built-in fallbacks — no external AI cost.
 *
 * Run explicitly: npm run test:e2e:smoke
 */
test.describe('Smoke @smoke', () => {
  test('health endpoint responds', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('healthy');
    expect(body.timestamp).toBeTruthy();
  });

  test('full interview path works with server-side fallbacks (no Gemini)', async ({ page }) => {
    await gotoDashboard(page);

    await page.locator('#start-interview-btn').click();
    await page.locator('#setup-screen-container').waitFor();
    await page.getByRole('button', { name: 'Generate Simulated Session' }).click();

    await page.locator('#simulator-screen-container').waitFor();
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });

    await expect(page.getByRole('heading', { name: /Definition$/ })).toBeVisible();

    const chatInput = page.getByPlaceholder(/Explain your thought process/i);
    await chatInput.fill('Smoke test candidate message.');
    await chatInput.press('Enter');
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });

    await expect(page.getByText('Smoke test candidate message.')).toBeVisible();

    await page.locator('#end-session-dashboard-btn').click();
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });

    await expect(page.locator('#feedback-report-screen')).toBeVisible();
  });
});
