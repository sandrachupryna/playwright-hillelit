import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../base/base-modal';
import type { UserRegistrationData } from '../';

export enum RegistrationField {
  Name = 'name',
  LastName = 'lastName',
  Email = 'email',
  Password = 'password',
  RepeatPassword = 'repeatPassword'
}

export class RegistrationModal extends BaseModal{
  private readonly ERROR_COLOR = 'rgb(220, 53, 69)';

  private readonly fieldIdMapping: Record<RegistrationField, string> = {
    [RegistrationField.Name]: '#signupName',
    [RegistrationField.LastName]: '#signupLastName',
    [RegistrationField.Email]: '#signupEmail',
    [RegistrationField.Password]: '#signupPassword',
    [RegistrationField.RepeatPassword]: '#signupRepeatPassword',
  };

  constructor(page: Page) {
    super(page, 'app-signup-modal');
  }

  private get heading() {
    return this.root.getByRole('heading');
  }

  private get registerButton(): Locator {
    return this.root.getByRole('button', { name: 'Register' });
  }

  private getFormGroup(inputId: string): Locator {
    return this.root.locator('.form-group').filter({ has: this.page.locator(inputId) });
  }
    
  private async expectLabelText(inputId: string, expectedText: string) {
    const label = this.getFormGroup(inputId).locator('label');
    await expect(label).toHaveText(expectedText);
  }

  private getErrorMessage(fieldId: string): Locator {
    return this.getFormGroup(fieldId).locator('.invalid-feedback');
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.heading).toContainText('Registration');
  }

  async checkAllLabels() {
    await this.expectLabelText(this.fieldIdMapping[RegistrationField.Name], 'Name');
    await this.expectLabelText(this.fieldIdMapping[RegistrationField.LastName], 'Last name');
    await this.expectLabelText(this.fieldIdMapping[RegistrationField.Email], 'Email');
    await this.expectLabelText(this.fieldIdMapping[RegistrationField.Password], 'Password');
    await this.expectLabelText(this.fieldIdMapping[RegistrationField.RepeatPassword], 'Re-enter password');
    return this;
  }

  private getInputField(fieldId: string): Locator {
    return this.root.locator(fieldId);
  }

  async fillRegistrationForm(
    options: {
      overrides?: Partial<UserRegistrationData>;
      excludedField?: RegistrationField | null;
    } = {}
  ) {
    const { overrides = {}, excludedField = null } = options;
    const id = Math.floor(Date.now() / 10);

    const validData: UserRegistrationData = {
      name: 'Name',
      lastName: 'LastName',
      email: `aqa-${id}@test.com`,
      password: `Ps${id}`,
      repeatPassword: `Ps${id}`,
      ...overrides,
    };
    
    const fieldDataMapping: Record<RegistrationField, string> = {
      [RegistrationField.Name]: validData.name,
      [RegistrationField.LastName]: validData.lastName,
      [RegistrationField.Email]: validData.email,
      [RegistrationField.Password]: validData.password,
      [RegistrationField.RepeatPassword]: validData.repeatPassword,
    };

    for (const field of Object.values(RegistrationField)) {
      if (field === excludedField) {
        const locator = this.getInputField(this.fieldIdMapping[field]);
        await locator.clear();
        continue;
      }

      const fieldId = this.fieldIdMapping[field];
      const value = fieldDataMapping[field];
      await this.getInputField(fieldId).fill(value);
    }

    await this.triggerBlur();
    return validData;
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async expectRegisterButtonEnabled() {
    await expect(this.registerButton).toBeEnabled();
  }

  async expectRegisterButtonDisabled() {
    await expect(this.registerButton).toBeDisabled();
  }

  async expectInvalidFieldAndMessage(field: RegistrationField, message: string) {
    const fieldId = this.fieldIdMapping[field];
    const input = this.getInputField(fieldId);
    const errorLabel = this.getErrorMessage(fieldId);

    await expect(input).toHaveClass(/is-invalid/);
    await expect(input).toHaveCSS('border-color', this.ERROR_COLOR);

    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toHaveText(message);
    await expect(errorLabel).toHaveCSS('color', this.ERROR_COLOR);
  }

  async expectNoErrorMessage(field: RegistrationField){
    const errorLabel = this.getErrorMessage(this.fieldIdMapping[field]);
    await expect(errorLabel).toHaveCount(0);
  }
}
