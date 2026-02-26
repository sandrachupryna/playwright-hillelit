import { Page, expect } from '@playwright/test';

export abstract class BasePage {

  constructor(protected page: Page, private url: string) {
    this.page = page;
    this.url = url;
  }

  async open() {
    await this.page.goto(this.url);
    return this;
  }

  async reload() {
    await this.page.reload();
    return this;
  }

  async clearCookies() {
    await this.page.context().clearCookies();
    return this;
  }

  async expectToContainInfoMessage(text: string) {
    await expect(this.page.locator('body')).toContainText(text);
  }
}