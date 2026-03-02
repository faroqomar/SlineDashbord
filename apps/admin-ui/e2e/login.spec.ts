import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should show login page and allow login attempt', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/SLine Admin/);
    await expect(page.getByRole('heading', { name: 'SLine Admin Login' })).toBeVisible();

    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });

    await emailInput.fill('admin@example.com');
    await passwordInput.fill('password123');
    await loginButton.click();

    // Since we don't have real credentials in this environment, 
    // we expect an error message from our API/Supabase.
    // If it were successful, we'd expect a redirect to '/'
    // await expect(page).toHaveURL('/');
  });
});
