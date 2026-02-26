import { Page, Locator } from '@playwright/test';
import { BaseModal } from '../base/base-modal';

export class LoginModal extends BaseModal{
  constructor(page: Page) {
    super(page, 'app-signin-modal');
  }

  private get loginButton(): Locator {
    return this.root.getByRole('button', { name: 'Login' });
  }

  private get emailInput(): Locator {
    return this.root.getByLabel('Email');
  }
  
  private get passwordInput(): Locator {
    return this.root.getByLabel('Password');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async login(email: string, password: string) {
    await this.fillLoginForm(email, password);
    await this.clickLogin();
  }
}