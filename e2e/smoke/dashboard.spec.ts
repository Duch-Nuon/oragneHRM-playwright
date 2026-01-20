import { test, expect } from '@playwright/test';
import 'dotenv/config';

test.describe('Dashboard Smoke Test', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto(process.env.BASE_URL + "/web/index.php/dashboard/index", { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.close();
  });

});
