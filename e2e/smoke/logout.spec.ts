import { test, expect } from '@playwright/test';
import 'dotenv/config';

test.describe('Dashboard + Logout (Smoke)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/dashboard/index', { waitUntil: 'networkidle' });
  });

  test('dashboard loads', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.close();
  });

  test('logout works', async ({ page }) => {
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page.getByRole('heading')).toContainText('Login');
    await page.context().storageState({ path: 'storage/auth.json' });
    await page.close();
  });
});

