import { test, expect} from '@playwright/test';
import 'dotenv/config';

test.describe('Forget Password (OTP)',
    {
        tag: '@otp',
    },
    () => {

    test('request password reset code with valid user', async ({ page }) => {

        await page.goto('/web/index.php/auth/requestPasswordResetCode', { waitUntil: 'networkidle', timeout: 90000 });
        await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('orangehrm');
        await page.getByRole('button', { name: 'Reset Password' }).click();

        await page.waitForURL('web/index.php/auth/sendPasswordReset', { waitUntil: 'networkidle', timeout: 90000});

        await expect(page.getByRole('heading', { name: 'Reset Password link sent' })).toBeVisible();
    });

    test('to get link and reset password', async ({ page }) => {
        await page.goto(process.env.BASE_MAIL_URL || '', { waitUntil: 'networkidle', timeout: 90000 });
    });
    
});