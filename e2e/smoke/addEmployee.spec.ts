
import { getRandomEmployees, getRandomEmployee } from '../../helpers/data';
import { test, expect } from '@playwright/test';

test.describe('Add Employee (Smoke)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'networkidle' });
  });

    // For 3 employees
  const employees = getRandomEmployees();

test('add employee works', async ({ page }) => {

    await page.getByRole('link', { name: 'PIM' }).click();

    for(let i = 0; i < employees.length; i++) {

        await expect(page.getByRole('link', { name: 'Add Employee' })).toBeVisible();
        await page.getByRole('listitem').filter({ hasText: 'Add Employee' }).click();

        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.locator('form')).toContainText('Required');
        await expect(page.locator('form')).toContainText('Required');  

        await page.getByRole('textbox', { name: 'First Name' }).fill(employees[i].firstName);
        await page.getByRole('textbox', { name: 'Middle Name' }).click();
        await page.getByRole('textbox', { name: 'Middle Name' }).fill(employees[i].middleName);
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill(employees[i].lastName);

        await expect(page.getByRole('textbox').nth(4)).toBeVisible();
        
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();
    }
  });
});