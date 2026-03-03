import { test as base } from '@playwright/test';
import { GaragePage } from '../pages/garage-page';

type Fixtures = {
  userGaragePage: GaragePage;
};

export const test = base.extend<Fixtures>({
  userGaragePage: async ({ page }, use) => {
    const garagePage = new GaragePage(page);

    await garagePage.open();
    await garagePage.expectLoaded();

    await use(garagePage);
  },
});