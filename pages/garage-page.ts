import { expect, Page } from '@playwright/test';
import { BasePage } from './base/base-page';
import { AddCarModal } from './modals/add-car-modal';

export class GaragePage extends BasePage {
  constructor(page: Page) {
    super(page, "/panel/garage");
  }

  private get tabTitle() {
    return this.page.getByRole('heading', { name: 'Garage' });
  }

  private get addCarButton() {
    return this.page.getByRole('button', { name: 'Add car' });
  }

  private get emptyMessage() {
    return this.page.getByText(
      'You don’t have any cars in your garage'
    );
  }

  private get carList() {
    return this.page.locator('.panel-page .car-item');
  }

  async expectLoaded() {
    await expect(this.tabTitle).toBeVisible();
  }

  async expectAddCarButtonVisible() {
    await expect(this.addCarButton).toBeVisible();
    await expect(this.addCarButton).toBeEnabled();
  }

  async expectEmptyState() {
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.carList).not.toBeVisible();
  }

  async shouldHaveCarCards(count: number) {
    await expect(this.carList).toHaveCount(count);
  }

  async openAddCarModal() {
    await this.addCarButton.click();
    return new AddCarModal(this.page);
  }
}