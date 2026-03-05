import { Page, Locator, expect } from '@playwright/test';
import { Sidebar } from './componets/sidebar';
import { BasePage } from './base/base-page';

export class ProfilePage extends BasePage{
  readonly sidebar: Sidebar;

  constructor(page: Page) {
    super(page, "/panel/profile");
    this.sidebar = new Sidebar(page);
  }

  private get tabTitle() {
    return this.page.getByRole('heading', { name: 'Profile' });
  }

  private get editProfileButton() {
    return this.page.getByRole('button', { name: 'Edit profile' });
  }

  private get avatar() {
    return this.page.locator('.profile').getByAltText(/user photo/i);
  }

  private get userName() {
    return this.page.locator('.profile_name');
  }

  async expectLoaded() {
    await expect(this.tabTitle).toBeVisible();
  }

  async openEditProfile() {
    await this.editProfileButton.click();
  }

  async expectEditProfileButtonVisible() {
    await expect(this.editProfileButton).toBeVisible();
    await expect(this.editProfileButton).toBeEnabled();
  }

  async checkUserName(expected: string) {
    await expect(this.userName).toBeVisible();
    await expect(this.userName).toHaveText(expected);
  }

  async expectAvatarVisible() {
    await expect(this.avatar).toBeVisible();
  }
}