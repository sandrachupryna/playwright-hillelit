import { BasePage } from './base/base-page'
import { Page } from '@playwright/test';
import { RegistrationModal, LoginModal } from '.';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, "/");
  }

  private get signUpButton() {
    return this.page.getByRole('button', { name: 'Sign up' });
  }

  private get signInButton() {
    return this.page.getByRole('button', { name: 'Sign In' });
  }
  async openRegistrationModal() {
    await this.signUpButton.click();
    const modal = new RegistrationModal(this.page);
    await modal.expectOpened();
    return modal;
  }

  async openLoginModal() {
    await this.signInButton.click();
    const modal = new LoginModal(this.page);
    await modal.expectOpened();
    return modal;
  }
}