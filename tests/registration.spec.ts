import { test, expect } from '@playwright/test';
import registrationData from '../test-data/registration.json' with { type: 'json' };
import { Page } from '@playwright/test';

type RegistrationOverrides = {
  overrides?: Partial<Record<string, string>>;
  excludedField?: string | null;
};

/**
 * Helpers 
 **/

interface UserCredentials {
  signupEmail: string;
  signupPassword: string;
  signupLastName: string;
  signupName: string;
  signupRepeatPassword: string;
}

const ERROR_COLOR = 'rgb(220, 53, 69)';

async function openHomeAndOpenRegistrationForm(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.locator('app-signup-modal')).toBeVisible();
}
async function checkLabelByInputId(page: Page, inputId: string, expectedText: string) {
  const container = page.locator('.form-group', { has: page.locator(inputId) });
  await expect(container.locator('label')).toHaveText(expectedText);
}

async function fillRegistrationForm( page: Page, 
  options: { overrides? : Partial<UserCredentials>, 
    excludedField?: keyof UserCredentials | null} = {}) {
  const { overrides = {}, excludedField = null } = options;
  const id = Math.floor(Date.now() / 10);

  const validData = {
    signupName: 'Name',
    signupLastName: 'LastName',
    signupEmail: `aqa-${id}@test.com`,
    signupPassword: `Ps${id}`,
    signupRepeatPassword: `Ps${id}`,
    ...overrides,
  };

  for (const [field, value] of Object.entries(validData)) {
    const locator = page.locator('app-signup-form').locator(`#${field}`);

    if (field === excludedField) {
      await locator.clear();
      continue;
    }
    // .fill() automatically clears the field before filling
    await locator.fill(value);
  }

  // simulate blur to trigger validation
  // await page.evaluate(() => (document.activeElement as HTMLElement).blur()); 
  await page.click('body');
  
  return validData;
};

function getErrorMessage(page: Page, field: string) {
  return page.locator(`.form-group`, { has: page.locator(`#${field}`) }).locator('.invalid-feedback');
};

async function expectInvalidFieldAndMessage(page: Page, field: keyof UserCredentials, message: string) {
  const input = page.locator('app-signup-form').locator(`#${field}`);
  const  errorLabel = getErrorMessage(page,  field);
  
  await expect(input).toHaveClass(/is-invalid/);
  await expect(input).toHaveCSS('border-color', ERROR_COLOR);

  await expect(errorLabel).toBeVisible();
  await expect(errorLabel).toHaveText(message);
  await expect(errorLabel).toHaveCSS('color', ERROR_COLOR);}

/* ========================================================= */

test.describe('Check registration process', () => {
  test.beforeEach(async ({ page }) => {
    await openHomeAndOpenRegistrationForm(page);
  });

  test.describe('Check registration modal window', () => {
    test('Registration form appears after clicking sign up button', async ({ page }) => {
      await expect(page.locator('app-signup-modal')).toBeVisible();
      await expect(page.getByRole('heading')).toBeVisible();
      await expect(page.getByRole('heading')).toContainText('Registration');
    });

    test('Registration form disappears after clicking close button', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Close' })).toBeEnabled();
      await page.getByRole('button', { name: 'Close' }).click();
      await expect(page.locator('app-signup-modal')).not.toBeAttached() ;
    });
  });

  test.describe('Smoke tests', () => {
    test('Registration with valid data', async ({ page }) => {
      await test.step('Check labels for all fields', async () => {
        // await expect(page.getByLabel('Name')).toBeVisible(); - is not possible to use because of 
        // the worng label.for=signupEmail, not input.id=signupName
        await checkLabelByInputId(page, '#signupName', 'Name');
        await checkLabelByInputId(page, '#signupLastName', 'Last name');
        await checkLabelByInputId(page, '#signupEmail', 'Email');
        await checkLabelByInputId(page, '#signupPassword', 'Password');
        await checkLabelByInputId(page, '#signupRepeatPassword', 'Re-enter password');
      });
    
      await test.step('Fill registration form with valid data', async () => {
        await fillRegistrationForm(page);
      });
      await test.step('Check that registration button is enabled after filling form with valid data and click it', async () => {
        await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled();
        await page.getByRole('button', { name: 'Register' }).click();
      });

      await test.step('Check that registration modal is closed after successful registration', async () => {
        await expect(page.locator('app-signup-modal')).not.toBeAttached();
      });

      await test.step('Check that success message appears after registration', async () => {
        await expect(page.locator('body')).toContainText('Registration complete');
      });
    });

    test('Check login with registered user', async ({ page, browser }) => {
      let user: UserCredentials;
      await test.step('Register new user', async () => {
        user = await fillRegistrationForm(page);
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.locator('app-signup-modal')).not.toBeAttached();
      });

      await test.step('Login with registered user in the new context', async () => {
        // logout 
        await page.context().clearCookies();
        await page.reload();

        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.getByLabel( 'Email' ).fill(user.signupEmail!);
        await page.getByLabel( 'Password' ).fill(user.signupPassword!);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('body')).toContainText(
          'You have been successfully logged in'
        );
      });
    });
  });

  test.describe('Check fields validation', () => {
    test.describe('Required fields validation', () => {
      const requiredFields = [
        { field: 'signupName', message: 'Name required' },
        { field: 'signupLastName', message: 'Last name required' },
        { field: 'signupEmail', message: 'Email required' },
        { field: 'signupPassword', message: 'Password required' },
        { field: 'signupRepeatPassword', message: 'Re-enter password required' },
      ];

      for (const { field, message } of requiredFields) {
        test(`Required validation for ${field}`, async ({ page }) => {
          await fillRegistrationForm(page, { excludedField: field as keyof UserCredentials});
          await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
          await expectInvalidFieldAndMessage(page, field as keyof UserCredentials, message);
        });
      }
    });

    test.describe('Name length validation', () => {
      const cases = [
        { value: 'A', valid: false },
        { value: 'Ab', valid: true },
        { value: 'A'.repeat(20), valid: true },
        { value: 'A'.repeat(21), valid: false },
      ];

      for (const { value, valid } of cases) {
        test(`Name boundary check: "${value}"`, async ({ page }) => {
          await fillRegistrationForm(page, { overrides: { signupName: value } , });

          if (!valid) {
            await expectInvalidFieldAndMessage(
              page,
              'signupName',
              'Name has to be from 2 to 20 characters long'
            );
          } else {
            await expect(getErrorMessage(page, 'signupName')).toHaveCount(0);
          }
        });
      }
    });

    test.describe('Invalid Name characters', () => {
      const invalidNames = registrationData.invalidNames;
      for (const value of invalidNames) {
        test(`Invalid name: ${value}`, async ({ page }) => {
          await fillRegistrationForm( page, { overrides: { signupName: value } });
          await expectInvalidFieldAndMessage( page, 'signupName','Name is invalid');
          await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
        });
      }
    });

    test.describe('Invalid Emails', () => {
      for (const value of registrationData.invalidEmails) {
        test(`Invalid email: ${value.replaceAll('@', '[at]')}`, async ({ page }) => {
          await fillRegistrationForm(page, { overrides: { signupEmail: value } });
          await expectInvalidFieldAndMessage( page, 'signupEmail', 'Email is incorrect');
          await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
        });
      }
    });

    test.describe('Password complexity validation', () => {
      const errorMessage =
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';

      for (const value of registrationData.invalidPasswords) {
        test(`Invalid password: ${value}`, async ({ page }) => {
          await fillRegistrationForm(page, {
            overrides: {
              signupPassword: value,
              signupRepeatPassword: value,
            },
          });

          await expectInvalidFieldAndMessage(page, 'signupPassword', errorMessage);
          await expectInvalidFieldAndMessage(page, 'signupRepeatPassword', errorMessage);

          await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
        });
      }
    });

    test('Passwords match validation', async ({ page }) => {
        await fillRegistrationForm(page, {
          overrides: {
            signupPassword: 'ValidPass1',
            signupRepeatPassword: 'DifferentPass1',
          },
        });

        await expectInvalidFieldAndMessage(
          page,
          'signupRepeatPassword',
          'Passwords do not match'
        );

        await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    });
  });
});