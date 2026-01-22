import { test, expect} from '@playwright/test';

test.describe('Forget Password (OTP)',
    {
        tag: '@otp',
    },
    () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/auth/requestPasswordResetCode', { waitUntil: 'networkidle', timeout: 90000 });
    });

    test('request password reset code with valid user', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill('orangehrm');
        await page.getByRole('button', { name: 'Reset Password' }).click();

        await expect(page.getByText('SuccessRequest Password Reset Code sent successfully×')).toBeVisible();
    });

});