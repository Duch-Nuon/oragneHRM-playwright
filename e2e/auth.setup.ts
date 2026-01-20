import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

const authFile = path.join(__dirname, 'storage', 'auth.json');

setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  
  await login.goto();
  await login.login(
    process.env.ORANGEHRM_USER ?? 'Admin',
    process.env.ORANGEHRM_PASS ?? 'admin123'
  );

  await page.context().storageState({ path: authFile });
  await page.close();

});
