import { test, expect } from '@playwright/test';
import { gotoDashboard } from './helpers/auth';
import { launchAlgoSession, mockInterviewApis, MOCK_CODE_RUN_RESPONSE } from './helpers/api-mocks';

test.describe('Code run flow (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await mockInterviewApis(page);
    await gotoDashboard(page);
    await launchAlgoSession(page);
  });

  test('runs test cases and shows terminal results', async ({ page }) => {
    await page.locator('#run-cases-btn').click();
    await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' }).catch(() => {});

    await page.getByRole('button', { name: 'Terminal Tests' }).click();
    await expect(page.getByText(MOCK_CODE_RUN_RESPONSE.consoleLogs.trim())).toBeVisible();
    await expect(page.getByText('Case 1: Input arg ([2,7,11,15], 9)')).toBeVisible();
    await expect(page.getByText('Passed').first()).toBeVisible();
  });

  test('code run network failure falls back to offline terminal output', async ({ page }) => {
    await page.unroute('**/api/code/run');
    await page.route('**/api/code/run', (route) => route.abort('failed'));

    await page.locator('#run-cases-btn').click();
    await page.getByRole('button', { name: 'Terminal Tests' }).click();

    await expect(page.getByText(/OFFLINE TEST RUN|Case 1: Passed/i)).toBeVisible();
  });
});
