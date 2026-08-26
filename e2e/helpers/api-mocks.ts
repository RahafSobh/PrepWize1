import { Page, Route } from '@playwright/test';

export const MOCK_START_RESPONSE = {
  initialMessage:
    'Welcome to your E2E Algo session. Today we will solve **Two Sum**. Explain your approach before coding.',
  problem: {
    title: 'Two Sum',
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    starterCode: 'function twoSum(nums, target) {\n  return [];\n}\n',
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
    ],
  },
};

export const MOCK_CHAT_RESPONSE = {
  text: 'Good explanation. What is the time and space complexity of your approach?',
};

export const MOCK_FEEDBACK_RESPONSE = {
  overallScore: 4,
  strengths: ['Clear communication', 'Correct high-level approach'],
  weaknesses: ['Could discuss edge cases earlier'],
  technicalAccuracyScore: 4,
  communicationSkillsScore: 5,
  answerQualityScore: 4,
  improvementSuggestions: ['Practice stating complexity upfront'],
  detailedSummary:
    '### E2E Assessment\nThe candidate explained the hash-map approach clearly and responded well to follow-ups.',
};

export const MOCK_CODE_RUN_RESPONSE = {
  runSuccess: true,
  language: 'Javascript',
  consoleLogs: 'Running 2 test cases...\n',
  results: [
    {
      caseNumber: 1,
      input: '[2,7,11,15], 9',
      expected: '[0,1]',
      actual: '[0,1]',
      passed: true,
    },
    {
      caseNumber: 2,
      input: '[3,2,4], 6',
      expected: '[1,2]',
      actual: '[1,2]',
      passed: true,
    },
  ],
};

type MockOptions = {
  start?: object | 'error';
  chat?: object | 'error';
  feedback?: object | 'error';
  codeRun?: object | 'error';
};

function jsonRoute(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/** Intercept interview + code-run APIs with deterministic fixtures. */
export async function mockInterviewApis(page: Page, options: MockOptions = {}) {
  const startBody = options.start === 'error' ? null : (options.start ?? MOCK_START_RESPONSE);
  const chatBody = options.chat === 'error' ? null : (options.chat ?? MOCK_CHAT_RESPONSE);
  const feedbackBody =
    options.feedback === 'error' ? null : (options.feedback ?? MOCK_FEEDBACK_RESPONSE);
  const codeRunBody =
    options.codeRun === 'error' ? null : (options.codeRun ?? MOCK_CODE_RUN_RESPONSE);

  await page.route('**/api/interview/start', async (route) => {
    if (options.start === 'error') {
      return jsonRoute(route, 500, { error: 'Simulated start failure' });
    }
    return jsonRoute(route, 200, startBody);
  });

  await page.route('**/api/interview/chat', async (route) => {
    if (options.chat === 'error') {
      return jsonRoute(route, 500, { error: 'Simulated chat failure' });
    }
    return jsonRoute(route, 200, chatBody);
  });

  await page.route('**/api/interview/feedback', async (route) => {
    if (options.feedback === 'error') {
      return jsonRoute(route, 500, { error: 'Simulated feedback failure' });
    }
    return jsonRoute(route, 200, feedbackBody);
  });

  await page.route('**/api/code/run', async (route) => {
    if (options.codeRun === 'error') {
      return jsonRoute(route, 500, { error: 'Simulated code run failure' });
    }
    return jsonRoute(route, 200, codeRunBody);
  });
}

export async function launchAlgoSession(page: Page) {
  await page.locator('#start-interview-btn').click();
  await page.locator('#setup-screen-container').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Generate Simulated Session' }).click();
  await page.locator('#simulator-screen-container').waitFor({ state: 'visible' });
  await page.locator('#simulator-loading-overlay').waitFor({ state: 'hidden' });
}
