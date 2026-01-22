
import { getRandomEmployees, getRandomEmployee } from '../../helpers/data';
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Add Employee (Smoke)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'networkidle', timeout: 90000 });
  });

    // For 3 employees
  const employees = getRandomEmployees();
  let emId = '';

test('add employee works', async ({ page }) => {

    const filePath_ValidateFail = path.resolve(__dirname, '../../public/images/upload_error_validate.png');
    const filePath_ValidateSuccess = path.resolve(__dirname, '../../public/images/upload_success.png');

    for(let i = 0; i < employees.length; i++) {

        await expect(page.getByRole('link', { name: 'Add Employee' })).toBeVisible();
        await page.getByRole('link', { name: 'Add Employee' }).click();
        
        await page.waitForLoadState('domcontentloaded');

        await clearUpload(page);
        await upLoadFile(filePath_ValidateFail, page);

        const error = page.getByText('Attachment Size Exceeded');

        const validated = await error.waitFor({ state: 'visible', timeout: 5000 })
                          .then(() => true)
                          .catch(() => false);

        if (validated) {
          await clearUpload(page);
          await upLoadFile(filePath_ValidateSuccess, page);
        }

        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
        await page.getByRole('button', { name: 'Save' }).click();
 
        await expect(page.getByText('Required').first()).toBeVisible();
        await expect(page.getByText('Required').nth(1)).toBeVisible();

        await page.getByRole('textbox', { name: 'First Name' }).fill(employees[i].firstName);
        await page.getByRole('textbox', { name: 'Middle Name' }).click();
        await page.getByRole('textbox', { name: 'Middle Name' }).fill(employees[i].middleName);
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill(employees[i].lastName);

        await expect(page.getByRole('textbox').nth(4)).toBeVisible();
        emId = await page.getByRole('textbox').nth(4).inputValue();
        
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Employee Id already exists')).toBeVisible().then(async () => {

          await page.getByRole('textbox').nth(4).fill('');
          const newEmId = (emId + Math.floor(Math.random() * 1000).toString() + 2);
          await page.getByRole('textbox').nth(4).fill(newEmId);
          await page.getByRole('button', { name: 'Save' }).click();

        }).finally(async () => {
           await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();
        });
    }
  });

test('search employee by Id', async ({ page }) => {

    await page.getByRole('listitem').filter({ hasText: 'Employee List' }).click();
    await page.getByRole('textbox').nth(2).click();
    await expect(page.getByRole('textbox').nth(2)).toBeEmpty();
    await page.getByRole('textbox').nth(2).fill(emId);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('table')).toContainText(emId);

});

  async function upLoadFile(path: string, page: any) {

    const [fileChooser] = await Promise.all([
          page.waitForEvent('filechooser'),
          await page.getByRole('button').nth(4).click()
        ]);

    await fileChooser.setFiles(path);
  }

  async function clearUpload(page: any) {
    const input = page.locator('input[type="file"]');
    if (await input.count()) {
      await input.setInputFiles([]); // ✅ reset upload
    }
  }

});