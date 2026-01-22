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

        await expect(page.getByRole('heading', { name: 'Reset Password link sent' })).toBeVisible();
    });

    test('to get link and reset password', async ({ page }) => {

        await page.goto(process.env.BASE_MAIL_URL || '', { waitUntil: 'networkidle', timeout: 90000 });

        await expect(page.getByText('OrangeHRM Password Reset').first()).toBeVisible();

        await expect(page.getByText('a few seconds ago').first()).toBeVisible();
        await page.getByText('OrangeHRM Password Reset').first().click();

        await expect(page.locator('#preview-html').contentFrame().locator('body')).toContainText('auth/resetPassword/resetCode/');

        const frame = await page.locator('#preview-html').contentFrame();
        // Get all text content
        const emailText = await frame.locator('body').innerText();

        // // Extract the URL using regex
        const resetLink = emailText.match(/http[s]?:\/\/[^\s]+/) ?? [];

        await page.goto(resetLink[0] as string, { waitUntil: 'networkidle', timeout: 90000 });

        await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

        await page.locator('input[name="password"]').fill('123456+-*/@Abc');
        await page.locator('input[name="confirmPassword"]').fill('123456+-*/@Abc');

        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();

        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        await page.close();
    });
    
});