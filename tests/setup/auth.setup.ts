import { test as setup } from '@playwright/test';
import { HomePage } from '../../pages/home-page';
import { env } from '../../env';

setup('Authenticate test user', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();

  const loginModal = await homePage.openLoginModal();

  await loginModal.login(
    env.TEST_USER_EMAIL,
    env.TEST_USER_PASSWORD
  );

  await homePage.expectToContainInfoMessage(
          'You have been successfully logged in'
        );

  await page.context().storageState({
    path: 'auth/user.json'
  });
});