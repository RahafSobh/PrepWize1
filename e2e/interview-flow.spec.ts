import { test, expect } from '@playwright/test';
import { gotoDashboard } from './helpers/auth';
import {
  launchAlgoSession,
  mockInterviewApis,
  MOCK_CHAT_RESPONSE,
  MOCK_FEEDBACK_RESPONSE,
  MOCK_START_RESPONSE,
} from './helpers/api-mocks';

test.describe('Interview flow (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await mockInterviewApis(page);
    await gotoDashboard(page);
  });

  test('configures interview on setup screen', async ({ page }) => {
    await page.locator('#start-interview-btn').click();
    await expect(page.locator('#setup-screen-container')).toBeVisible();

    await page.getByRole('button', { name: 'Behavioral' }).click();
    await page.getByRole('button', { name: 'Friendly' }).click();
    await page.locator('#setup-screen-container select').nth(0).selectOption('Backend');
    await page.locator('#setup-screen-container select').nth(1).selectOption('Senior');

    await expect(page.getByRole('button', { name: 'Behavioral' })).toHaveClass(/border-emerald-500/);
    await expect(page.getByRole('button', { name: 'Generate Simulated Session' })).toBeVisible();
  });

  test('starts interview and displays AI opening question', async ({ page }) => {
    await launchAlgoSession(page);

    await expect(page.getByText(MOCK_START_RESPONSE.initialMessage)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Two Sum Definition' })).toBeVisible();
    await expect(page.locator('textarea')).toHaveValue(MOCK_START_RESPONSE.problem.starterCode);
  });

  test('sends candidate answer and displays interviewer response', async ({ page }) => {
    await launchAlgoSession(page);

    const chatInput = page.getByPlaceholder(/Explain your thought process/i);
    await chatInput.fill('I would use a hash map to store complements.');
    await chatInput.press('Enter');

    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });
    await expect(page.getByText('I would use a hash map to store complements.')).toBeVisible();
    await expect(page.getByText(MOCK_CHAT_RESPONSE.text)).toBeVisible();
  });

  test('completes full flow through feedback report', async ({ page }) => {
    await launchAlgoSession(page);

    const chatInput = page.getByPlaceholder(/Explain your thought process/i);
    await chatInput.fill('Starting with a brute-force baseline, then optimizing.');
    await chatInput.press('Enter');
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });

    await page.locator('#end-session-dashboard-btn').click();
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });

    await expect(page.locator('#feedback-report-screen')).toBeVisible();
    await expect(page.getByText('AI Post-Interview Assessment')).toBeVisible();
    await expect(page.getByText('4 / 5').first()).toBeVisible();
    await expect(page.getByText(MOCK_FEEDBACK_RESPONSE.strengths[0])).toBeVisible();

    await page.getByRole('button', { name: 'Back to Dashboard' }).click();
    await expect(page.locator('#dashboard-view')).toBeVisible();
  });

  test('retake from feedback navigates back to setup', async ({ page }) => {
    await launchAlgoSession(page);
    await page.locator('#end-session-dashboard-btn').click();
    await page.locator('#feedback-report-screen').waitFor();

    await page.getByRole('button', { name: 'Retake/Practice Track' }).click();
    await expect(page.locator('#setup-screen-container')).toBeVisible();
  });
});
