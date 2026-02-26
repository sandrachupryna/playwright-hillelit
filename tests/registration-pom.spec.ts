import { test } from '@playwright/test';
import registrationData from '../test-data/registration.json' with { type: 'json' };
import { HomePage, RegistrationModal, UserRegistrationData, RegistrationField } from '../pages';


test.describe('Check registration process', () => {

  let homepage: HomePage;
  let registrationModal: RegistrationModal;

  test.beforeEach(async ({ page }) => {
    homepage = new HomePage(page);
    await homepage.open();
    registrationModal = await homepage.openRegistrationModal();
  });

  test.describe('Check registration modal window', () => {
    test('Registration form appears after clicking sign up button', async ({ page }) => {
      await registrationModal.expectOpened();
      await registrationModal.expectHeadingVisible();
    });

    test('Registration form disappears after clicking close button', async ({ page }) => {
      await registrationModal.clickCloseButton();
      await registrationModal.expectClosed();
    });
  });

  test.describe('Smoke tests', () => {
    test('Registration with valid data', async ({ page }) => {
      await test.step('Check labels for all fields', async () => {
        await registrationModal.checkAllLabels();
      });
    
      await test.step('Fill registration form with valid data', async () => {
        await registrationModal.fillRegistrationForm();
      });
      await test.step('Check that registration button is enabled after filling form with valid data and click it', async () => {
        await registrationModal.expectRegisterButtonEnabled();
        await registrationModal.clickRegister();
      });

      await test.step('Check that registration modal is closed after successful registration', async () => {
        await registrationModal.expectClosed();
      });

      await test.step('Check that success message appears after registration', async () => {
        await homepage.expectToContainInfoMessage('Registration complete');
      });
    });

    test('Check login with registered user', async ({ page, browser }) => {
      let user: UserRegistrationData;
      await test.step('Register new user', async () => {
        user = await registrationModal.fillRegistrationForm();
        await registrationModal.clickRegister();
        await registrationModal.expectClosed();
      });

      await test.step('Login with registered user in the new context', async () => {
        // logout 
        await homepage.clearCookies();
        await homepage.reload();

        const loginModal = await homepage.openLoginModal();
        await loginModal.login(user.email, user.password);

        await homepage.expectToContainInfoMessage(
          'You have been successfully logged in'
        );
      });
    });
  });

  test.describe('Check fields validation', () => {
    test.describe('Required fields validation', () => {
      const requiredFields = [
        { field: RegistrationField.Name, message: 'Name required' },
        { field: RegistrationField.LastName, message: 'Last name required' },
        { field: RegistrationField.Email, message: 'Email required' },
        { field: RegistrationField.Password, message: 'Password required' },
        { field: RegistrationField.RepeatPassword, message: 'Re-enter password required' },
      ];

      for (const { field, message } of requiredFields) {
        test(`Required validation for ${field}`, async ({ page }) => {
          await registrationModal.fillRegistrationForm( { excludedField: field });
          await registrationModal.expectRegisterButtonDisabled();
          await registrationModal.expectInvalidFieldAndMessage(field, message);
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
          await registrationModal.fillRegistrationForm({ overrides: { name: value } , });

          if (!valid) {
            await registrationModal.expectInvalidFieldAndMessage(
              RegistrationField.Name,
              'Name has to be from 2 to 20 characters long'
            );
          } else {
            await registrationModal.expectNoErrorMessage(RegistrationField.Name);
          }
        });
      }
    });

    test.describe('Invalid Name characters', () => {
      const invalidNames = registrationData.invalidNames;
      for (const value of invalidNames) {
        test(`Invalid name: ${value}`, async ({ page }) => {
          await registrationModal.fillRegistrationForm({ overrides: { name: value } });
          await registrationModal.expectInvalidFieldAndMessage(RegistrationField.Name, 'Name is invalid');
          await registrationModal.expectRegisterButtonDisabled();
        });
      }
    });

    test.describe('Invalid Emails', () => {
      for (const value of registrationData.invalidEmails) {
        test(`Invalid email: ${value.replaceAll('@', '[at]')}`, async ({ page }) => {
          await registrationModal.fillRegistrationForm({ overrides: { email: value } });
          await registrationModal.expectInvalidFieldAndMessage(RegistrationField.Email, 'Email is incorrect');
          await registrationModal.expectRegisterButtonDisabled();
        });
      }
    });

    test.describe('Password complexity validation', () => {
      const errorMessage =
        'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter';

      for (const value of registrationData.invalidPasswords) {
        test(`Invalid password: ${value}`, async ({ page }) => {
          await registrationModal.fillRegistrationForm({
            overrides: {
              password: value,
              repeatPassword: value,
            },
          });

          await registrationModal.expectInvalidFieldAndMessage(RegistrationField.Password, errorMessage);
          await registrationModal.expectInvalidFieldAndMessage(RegistrationField.RepeatPassword, errorMessage);

          await registrationModal.expectRegisterButtonDisabled();
        });
      }
    });

    test('Passwords match validation', async ({ page }) => {
        await registrationModal.fillRegistrationForm({
          overrides: {
            password: 'ValidPass1',
            repeatPassword: 'DifferentPass1',
          },
        });

        await registrationModal.expectInvalidFieldAndMessage(
          RegistrationField.RepeatPassword,
          'Passwords do not match'
        );

        await registrationModal.expectRegisterButtonDisabled();
    });
  });
});