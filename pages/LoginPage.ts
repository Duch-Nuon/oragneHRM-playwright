import { type Page, expect } from '@playwright/test';
import 'dotenv/config';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(process.env.BASE_URL + "/web/index.php/auth/login", { waitUntil: 'domcontentloaded', timeout: 60000});
  }

  async login(username: string, password: string) {
    await expect(this.page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
