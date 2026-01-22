import { test, expect } from '@playwright/test';
import  { getRandomAdmin, getRandomEssUser } from '../../helpers/data';


test.describe('Add Admin and ESS Role (Smoke)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/admin/saveSystemUser', { waitUntil: 'networkidle', timeout: 90000 });
    });

    const admin = getRandomAdmin();
    const essUser = getRandomEssUser();

    test('add admin role', async ({ page }) => {

        await expectValidate(page);

        await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
        await page.getByRole('option', { name: 'Admin' }).click();
        await page.getByRole('textbox', { name: 'Type for hints...' }).fill('s');
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('option', { name: 'Mijtzf Pjnhik Brbseoq' }).click();
        await page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
        await page.getByRole('option', { name: 'Enabled' }).click();
        await page.getByRole('textbox').nth(2).fill(admin.username);
        await page.getByRole('textbox').nth(3).fill('1234567+_@Abc');
        await page.getByRole('textbox').nth(4).fill('1234567+_@Abc');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();
    });

    test('add ess role', async ({ page }) => {

        await expectValidate(page);

        await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
        await page.getByRole('option', { name: 'ESS' }).click();
        await page.getByRole('textbox', { name: 'Type for hints...' }).fill('s');
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('option', { name: 'Mijtzf Pjnhik Brbseoq' }).click();
        await page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
        await page.getByRole('option', { name: 'Enabled' }).click();
        await page.getByRole('textbox').nth(2).fill(essUser.username);
        await page.getByRole('textbox').nth(3).fill('1234567+_@Abc');
        await page.getByRole('textbox').nth(4).fill('1234567+_@Abc');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();
    });

    async function expectValidate(page: any)
    {
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Required').first()).toBeVisible();
        await expect(page.getByText('Required').nth(1)).toBeVisible();
        await expect(page.getByText('Required').nth(2)).toBeVisible();
        await expect(page.getByText('Required').nth(3)).toBeVisible();
        await expect(page.getByText('Required').nth(4)).toBeVisible();
        await expect(page.getByText('Passwords do not match')).toBeVisible();
    }

});