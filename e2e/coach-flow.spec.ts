import { test, expect } from '@playwright/test';
import { gotoDashboard } from './helpers/auth';

const MOCK_AGENT_RESPONSE = {
  reply:
    'Based on your recent Behavioral sessions, focus on STAR structure and clearer metrics in your results.',
  suggestedAction: {
    type: 'launch_setup',
    label: 'Practice Behavioral (Mid-Level)',
    preferences: {
      type: 'Behavioral',
      difficulty: 'Mid-Level',
      role: 'Full Stack',
      language: 'English',
      style: 'Friendly',
      topic: 'Delivering Under Pressure',
    },
  },
};

test.describe('Prep Coach agent', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/agent/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_AGENT_RESPONSE),
      });
    });
    await gotoDashboard(page);
  });

  test('opens coach from dashboard and sends a message', async ({ page }) => {
    await page.locator('#open-prep-coach-btn').click();
    await expect(page.locator('#prep-coach-screen')).toBeVisible();

    const input = page.locator('#prep-coach-input');
    await input.fill('What should I practice next?');
    await page.getByLabel('Send message to Prep Coach').click();

    await expect(page.getByText(MOCK_AGENT_RESPONSE.reply)).toBeVisible();
    await expect(page.getByText('Recommended next session')).toBeVisible();
  });

  test('apply recommendation opens setup with prefilled track', async ({ page }) => {
    await page.locator('#open-prep-coach-btn').click();
    await page.locator('#prep-coach-input').fill('I struggle with behavioral interviews.');
    await page.getByLabel('Send message to Prep Coach').click();
    await expect(page.getByText(MOCK_AGENT_RESPONSE.reply)).toBeVisible();

    await page.locator('#apply-coach-recommendation-btn').click();
    await expect(page.locator('#setup-screen-container')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Behavioral' })).toHaveClass(/border-emerald-500/);
  });
});
