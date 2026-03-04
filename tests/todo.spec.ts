import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Adding tasks', () => {
  test('should add a new task when submitting the input', async ({ page }) => {
    await page.getByPlaceholder('What needs to be done?').fill('Buy groceries');
    await page.keyboard.press('Enter');

    await expect(page.getByRole('listitem').filter({ hasText: 'Buy groceries' })).toBeVisible();
  });

  test('should clear the input after adding a task', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await page.keyboard.press('Enter');

    await expect(input).toHaveValue('');
  });

  test('should not add an empty task', async ({ page }) => {
    await page.keyboard.press('Enter');

    await expect(page.getByRole('list')).not.toBeVisible();
  });
});

test.describe('Completing tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByPlaceholder('What needs to be done?').fill('Buy groceries');
    await page.keyboard.press('Enter');
  });

  test('should mark a task as complete when clicking its checkbox', async ({ page }) => {
    await page.getByRole('checkbox', { name: 'Buy groceries' }).click();

    await expect(page.getByRole('listitem').filter({ hasText: 'Buy groceries' })).toHaveClass(/completed/);
  });

  test('should unmark a completed task', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: 'Buy groceries' });
    await checkbox.click();
    await checkbox.click();

    await expect(page.getByRole('listitem').filter({ hasText: 'Buy groceries' })).not.toHaveClass(/completed/);
  });
});

test.describe('Deleting tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByPlaceholder('What needs to be done?').fill('Buy groceries');
    await page.keyboard.press('Enter');
  });

  test('should remove a task when clicking delete', async ({ page }) => {
    const item = page.getByRole('listitem').filter({ hasText: 'Buy groceries' });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();

    await expect(item).not.toBeVisible();
  });
});

test.describe('Filtering tasks', () => {
  test.beforeEach(async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Buy groceries');
    await page.keyboard.press('Enter');
    await input.fill('Walk the dog');
    await page.keyboard.press('Enter');
    await input.fill('Read a book');
    await page.keyboard.press('Enter');

    await page.getByRole('checkbox', { name: 'Walk the dog' }).click();
  });

  test('should show all tasks by default', async ({ page }) => {
    await expect(page.getByRole('listitem')).toHaveCount(3);
  });

  test('should show only active tasks when clicking Active', async ({ page }) => {
    await page.getByRole('link', { name: 'Active' }).click();

    await expect(page.getByRole('listitem')).toHaveCount(2);
    await expect(page.getByRole('listitem').filter({ hasText: 'Walk the dog' })).not.toBeVisible();
  });

  test('should show only completed tasks when clicking Completed', async ({ page }) => {
    await page.getByRole('link', { name: 'Completed' }).click();

    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'Walk the dog' })).toBeVisible();
  });

  test('should show all tasks when clicking All', async ({ page }) => {
    await page.getByRole('link', { name: 'Active' }).click();
    await page.getByRole('link', { name: 'All' }).click();

    await expect(page.getByRole('listitem')).toHaveCount(3);
  });
});

test.describe('Footer', () => {
  test('should show the count of remaining active tasks', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Buy groceries');
    await page.keyboard.press('Enter');
    await input.fill('Walk the dog');
    await page.keyboard.press('Enter');

    await page.getByRole('checkbox', { name: 'Buy groceries' }).click();

    await expect(page.getByText('1 item left')).toBeVisible();
  });

  test('should clear all completed tasks when clicking "Clear completed"', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Buy groceries');
    await page.keyboard.press('Enter');
    await input.fill('Walk the dog');
    await page.keyboard.press('Enter');

    await page.getByRole('checkbox', { name: 'Buy groceries' }).click();
    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'Buy groceries' })).not.toBeVisible();
  });
});
