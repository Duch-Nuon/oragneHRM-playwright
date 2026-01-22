import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'storage/auth.json';

setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  
  await login.goto();
  await login.login(
    process.env.ORANGEHRM_USER ?? 'Admin',
    process.env.ORANGEHRM_PASS ?? 'admin123'
  );

  await page.waitForLoadState('networkidle', { timeout: 90000 });

  await page.context().storageState({ path: authFile });
});
