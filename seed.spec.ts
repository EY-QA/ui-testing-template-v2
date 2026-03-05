// seed.spec.ts
import { test, expect } from '@playwright/test';
import 'dotenv/config';

test('seed: login and save authenticated state', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory\.html/);

  
});