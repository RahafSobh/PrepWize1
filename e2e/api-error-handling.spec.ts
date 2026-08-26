import { test, expect } from '@playwright/test';
import { gotoDashboard } from './helpers/auth';
import { launchAlgoSession, mockInterviewApis } from './helpers/api-mocks';

test.describe('API error handling (client fallbacks)', () => {
  test('start failure still renders offline welcome and sample problem', async ({ page }) => {
    await mockInterviewApis(page, { start: 'error' });
    await gotoDashboard(page);
    await launchAlgoSession(page);

    await expect(page.getByRole('heading', { name: 'Two Sum Definition' })).toBeVisible();
    await expect(page.getByText(/AI Interviewer/i)).toBeVisible();
  });

  test('chat failure still appends offline interviewer reply', async ({ page }) => {
    await mockInterviewApis(page, { chat: 'error' });
    await gotoDashboard(page);
    await launchAlgoSession(page);

    const chatInput = page.getByPlaceholder(/Explain your thought process/i);
    await chatInput.fill('My approach uses sorting first.');
    await chatInput.press('Enter');

    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });
    await expect(page.getByText('My approach uses sorting first.')).toBeVisible();
    await expect(page.getByText(/solid point|edge cases|alternative solutions/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test('feedback failure still opens report with offline template', async ({ page }) => {
    await mockInterviewApis(page, { feedback: 'error' });
    await gotoDashboard(page);
    await launchAlgoSession(page);

    await page.locator('#end-session-dashboard-btn').click();
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });

    await expect(page.locator('#feedback-report-screen')).toBeVisible();
    await expect(page.getByText(/Dynamic Performance Review/i)).toBeVisible();
  });
});
