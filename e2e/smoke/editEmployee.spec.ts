import {test, expect} from '@playwright/test';
import { getRandomEmployees, getRandomEmployee } from '../../helpers/data';
import { time } from 'node:console';

test.describe('Edit Employee and Update (Smoke)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'networkidle', timeout: 90000 });
    });

   test('Personal Details', async ({page}) => {
    
        await page.waitForLoadState('domcontentloaded');
        const employee = getRandomEmployee();

        await expect(page.getByRole('button').filter({ hasText: /^$/ }).nth(3)).toBeVisible();
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();

        await page.getByRole('textbox', { name: 'First Name' }).fill(employee.firstName);
        await page.getByRole('textbox', { name: 'Middle Name' }).fill(employee.middleName);
        await page.getByRole('textbox', { name: 'Last Name' }).fill(employee.lastName);

        const date = '1999-12-05';

        try {
            await page.getByRole('textbox', { name: 'dd-mm-yyyy' }).first().fill(date, { timeout: 2000 });
        } catch {
            await page.getByRole('textbox', { name: 'mm-dd-yyyy' }).first().fill(date, { timeout: 2000 });
        }

        await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
        await page.getByRole('option', { name: 'Colombian' }).click();

        await page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
        await page.getByRole('option', { name: 'Single' }).click();

        try {
            await page.getByRole('textbox', { name: 'dd-mm-yyyy' }).nth(1).fill('2023-09-22', { timeout: 2000 });
        } catch {
            await page.getByRole('textbox', { name: 'mm-dd-yyyy' }).nth(1).fill('2023-09-22', { timeout: 2000 });
        }

        await page.getByText('Male', { exact: true }).click();

        await expect(page.locator('form').filter({ hasText: 'Employee Full NameEmployee' }).getByRole('button')).toBeVisible();

        await page.locator('form').filter({ hasText: 'Employee Full NameEmployee' }).getByRole('button').click();

        await expect(page.getByText('SuccessSuccessfully Updated×')).toBeVisible();
    });

    test('Contact Details', async ({ page }) => {
         const employee = getRandomEmployee();
        // Navigate to first employee edit button
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();

        // Click on Contact Details tab to navigate to contact details form
        await page.getByRole('link', { name: 'Contact Details' }).click();

        await page.getByRole('textbox').nth(1).click();
        // Enter street address line 1
        await page.getByRole('textbox').nth(1).fill('123 Main Street');

        await page.getByRole('textbox').nth(2).click();
        // Enter street address line 2
        await page.getByRole('textbox').nth(2).fill('Apt 456');

        await page.getByRole('textbox').nth(3).click();
        // Enter city
        await page.getByRole('textbox').nth(3).fill('New York');

        await page.getByRole('textbox').nth(4).click();
        // Enter state/province
        await page.getByRole('textbox').nth(4).fill('NY');

        await page.getByRole('textbox').nth(5).click();
        // Enter postal code
        await page.getByRole('textbox').nth(5).fill('10001');

        // Enter home phone number
        await page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill('555-1234');

        // Enter mobile phone number
        await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('555-5678');

        // Enter work phone number
        await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('555-9999');

        // Enter work email
        await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill(employee.emailCompany);

        // Enter other email
        await page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(employee.emailPersonal);

        // Click on Country dropdown to select a country
        await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').click();

        // Select United States from country dropdown
        await page.getByRole('option', { name: 'Barbados' }).click();

        // Verify the form still displays with the filled data
        await expect(page.getByRole('textbox').nth(1)).toHaveValue('123 Main Street');
        await expect(page.getByRole('textbox').nth(3)).toHaveValue('New York');

        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('SuccessSuccessfully Updated×')).toBeVisible();

    });

});