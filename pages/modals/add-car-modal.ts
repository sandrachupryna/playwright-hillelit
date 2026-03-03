import { expect, Page } from '@playwright/test';
import { BaseModal } from '../base/base-modal';

export class AddCarModal extends BaseModal{
  constructor(page: Page) {
    super(page, 'app-add-car-modal');
  }

  private get brandField() {
    return this.root.getByLabel('Brand');
  }

  private get modelField() {
    return this.root.getByLabel('Model');
  }

  private get mileageField() {
    return this.root.getByLabel('Mileage');
  }

  private get addButton() {
    return this.root.getByRole('button', { name: 'Add' });
  }

  private get cancelButton() {
    return this.root.getByRole('button', { name: 'Cancel' });
  }

  async expectFieldsVisible() {
    await expect(this.brandField).toBeVisible();
    await expect(this.modelField).toBeVisible();
    await expect(this.mileageField).toBeVisible();
  }

  async expectButtonsVisible() {
    await expect(this.addButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.closeButton).toBeVisible();
  }
}