import { test, expect } from '@playwright/test';
import { gotoDashboard } from './helpers/auth';

const SEED_SESSION = {
  id: 'e2e-historical-1',
  preferences: {
    type: 'Algo',
    difficulty: 'Mid-Level',
    role: 'Full Stack',
    language: 'Javascript',
    style: 'Neutral',
  },
  messages: [],
  problem: {
    title: 'Merge Intervals',
    description: 'Given an array of intervals...',
    starterCode: '',
    testCases: [],
  },
  status: 'completed',
  createdAt: '2026-05-18T14:30:00Z',
  feedback: {
    overallScore: 3,
    strengths: ['Cleared basic logic constraints'],
    weaknesses: ['Missed overlapping boundary condition indices'],
    technicalAccuracyScore: 3,
    communicationSkillsScore: 4,
    answerQualityScore: 2,
    improvementSuggestions: ['Consider sorting intervals before matching'],
    detailedSummary: '### Dynamic Performance Review\nThe candidate showed basic logic syntax.',
  },
};

test.describe('Dashboard report flow', () => {
  test('opens a past session report from dashboard history', async ({ page }) => {
    await page.addInitScript((session) => {
      localStorage.setItem('prepwise_authenticated', 'true');
      localStorage.setItem('prepwise_onboarded', 'true');
      localStorage.setItem(
        'prepwise_profile',
        JSON.stringify({
          name: 'E2E User',
          email: 'e2e@prepwize.test',
          avatarUrl: '🚀',
          plan: 'Free',
          simulationsCompleted: 1,
          role: 'Full Stack',
          streakCount: 1,
        }),
      );
      localStorage.setItem('prepwise_sessions', JSON.stringify([session]));
    }, SEED_SESSION);

    await page.goto('/');
    await page.locator('#dashboard-view').waitFor();

    await page.getByRole('button', { name: /Simulation Logs/i }).click();
    await page.locator('#view-report-e2e-historical-1').click();

    await expect(page.locator('#feedback-report-screen')).toBeVisible();
    await expect(page.getByText('Track: Algo')).toBeVisible();
    await expect(page.getByText('Cleared basic logic constraints')).toBeVisible();
  });

  test('navigates to pricing from dashboard upgrade CTA', async ({ page }) => {
    await gotoDashboard(page);
    await page.locator('#dashboard-pricing-btn').click();
    await expect(page.locator('#pricing-screen-container')).toBeVisible();
  });
});

test.describe('Plan gating', () => {
  test('blocks System Design on Free plan and redirects to pricing', async ({ page }) => {
    await gotoDashboard(page, { plan: 'Free' });

    await page.locator('#start-interview-btn').click();
    await page.getByRole('button', { name: 'System Design' }).click();
    await page.getByRole('button', { name: 'Generate Simulated Session' }).click();

    page.once('dialog', (dialog) => dialog.accept());
    await expect(page.locator('#pricing-screen-container')).toBeVisible();
  });
});
