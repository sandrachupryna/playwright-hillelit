import { Page, Locator } from '@playwright/test';
import { ProfilePage } from '../profile-page';

export class Sidebar {
  private root: Locator;

  constructor(private page: Page) {
    this.root = page.locator('nav.sidebar');
  }

  get garageLink() {
    return this.root.getByRole('link', { name: 'Garage' });
  }

  get expensesLink() {
    return this.root.getByRole('link', { name: 'Fuel expenses' });
  }

  get instructionsLink() {
    return this.root.getByRole('link', { name: 'Instructions' });
  }

  get profileLink() {
    return this.root.getByRole('link', { name: 'Profile' });
  }

  get settingsLink() {
    return this.root.getByRole('link', { name: 'Settings' });
  }

  get logOutLink() {
    return this.root.getByRole('link', { name: 'Log out' });
  }

  async goToGarage() {
    await this.garageLink.click();
  }

  async goToExpenses() {
    await this.expensesLink.click();
  }

  async goToInstructions() {
    await this.instructionsLink.click();
  }

  async goToProfile() {
    await this.profileLink.click();
    return new ProfilePage(this.page);
  }

  async goToSettings() {
    await this.settingsLink.click();
  }

  async logOut() {
    await this.logOutLink.click();
  }
}