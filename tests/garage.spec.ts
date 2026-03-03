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
});