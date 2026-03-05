import { test } from '../fixtures/user-garage.fixture';

test.describe('Garage tab', () => {

  test('Check empty garage', async ({ userGaragePage }) => {
    await userGaragePage.expectEmptyState();
    await userGaragePage.expectAddCarButtonVisible();
  });


  test('Check "Add a car" modal', async ({ userGaragePage }) => {
    const addCarModal = await userGaragePage.openAddCarModal();
    await addCarModal.expectOpened();
    await addCarModal.expectFieldsVisible();
    await addCarModal.expectButtonsVisible();
    });

  test('Check navigation to the Profile page', async({ userGaragePage }) => {
    const profilePage = await userGaragePage.sidebar.goToProfile();
    profilePage.expectLoaded();
    profilePage.expectEditProfileButtonVisible();
  });

  test('Check the mocked profile name', async ({ userGaragePage, page }) => {
    const mockedName = 'Oleksandra';
    const mockedLastName = 'Chupryna';

    await page.route('**/api/users/profile', async route => {
        const response = await route.fetch();
        let json = await response.json();
        json.data.name = mockedName;
        json.data.lastName = mockedLastName;
        console.log('Sending to browser:', JSON.stringify(json));
        route.fulfill({
            response,
            json
          });
    });

    const profilePage = await userGaragePage.sidebar.goToProfile();
    await profilePage.expectAvatarVisible();
    await profilePage.checkUserName(`${mockedName} ${mockedLastName}`);
    });
});