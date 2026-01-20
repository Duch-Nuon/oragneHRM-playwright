import { test, expect } from '@playwright/test';
import 'dotenv/config';

test.describe('Logout Test', () => {
    test('dashboard loads and logout', async ({ page }) => {
      await page.goto(process.env.BASE_URL + "/web/index.php/dashboard/index", { waitUntil: 'domcontentloaded' });
      await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page.getByRole('heading')).toContainText('Login');
      await page.close();
    });

});
