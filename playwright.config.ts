import { defineConfig, devices } from '@playwright/test';
import { env } from './env';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list',{ printSteps: true }]],
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.BASE_URL,
    httpCredentials: {
      username: env.BASIC_AUTH_USER,
      password: env.BASIC_AUTH_PASS
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1440 },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    ...browsers.map(browser => ({
      name: `E2E-${browser.name} public`,
      testDir: './tests/e2e',
      testMatch: /tests\/e2e\/public/,
      use: {
        ...browser.device,
      },
    })),
    ...browsers.map(browser => ({
      name: `E2E-${browser.name}`,
      testDir: './tests/e2e',
      testIgnore: /tests\/e2e\/public/,
      use: {
        ...browser.device,
        storageState: 'auth/user.json',
      },
      dependencies: ['setup'],
    })),
    {
      name: 'API tests',
      testDir: './tests/api',
      use: {
        storageState: 'auth/user.json',
      },
      dependencies: ['setup']
    }
  ]
});
