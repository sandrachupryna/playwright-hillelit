import { Locator, Page, expect } from '@playwright/test';

export abstract class BaseModal {
  protected root: Locator;

  constructor(protected page: Page, selector: string) {
    this.root = page.locator(selector);
  }

  private get closeButton() {
    return this.root.getByRole('button' , { name: 'Close'} )
  }

  async expectOpened() {
    await expect(this.root).toBeVisible();
  }

  async expectClosed() {
    await expect(this.root).toBeHidden();
  }

  async clickCloseButton() {
    await this.closeButton.click();
  }

  async triggerBlur() {
    await this.page.click('body');
  }
}