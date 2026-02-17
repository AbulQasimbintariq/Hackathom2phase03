import { test, expect } from '@playwright/test';

// Ensure backend (http://localhost:8000) and frontend (http://localhost:3000) are running.

const token = 'e2e-user';

test.beforeEach(async ({ page }) => {
    // Put token into localStorage so frontend sends it as Authorization header
    await page.addInitScript((t) => localStorage.setItem('token', t), token);
});

test('create task and show in list', async ({ page }) => {
    await page.goto('/');

    // Fill form
    await page.fill('input[placeholder="New task title"]', 'E2E Task 1');
    await page.fill('textarea[rows="3"]', 'Created by Playwright');
    // optional due date: select tomorrow
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const isoLocal = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    await page.fill('input[type="datetime-local"]', isoLocal);

    await page.click('button:has-text("Create Task")');

    // Wait for task to appear in list
    await expect(page.locator('text=E2E Task 1')).toBeVisible();
    await expect(page.locator('text=Created by Playwright')).toBeVisible();
    await expect(page.locator('text=Due:')).toBeVisible();
});

test('filter and sort tasks', async ({ page }) => {
    await page.goto('/');

    // create two tasks with different due dates via UI
    await page.fill('input[placeholder="New task title"]', 'A Task');
    const d1 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const d1iso = new Date(d1.getTime() - d1.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    await page.fill('input[type="datetime-local"]', d1iso);
    await page.click('button:has-text("Create Task")');
    await expect(page.locator('text=A Task')).toBeVisible();

    await page.fill('input[placeholder="New task title"]', 'B Task');
    const d2 = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const d2iso = new Date(d2.getTime() - d2.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    await page.fill('input[type="datetime-local"]', d2iso);
    await page.click('button:has-text("Create Task")');
    await expect(page.locator('text=B Task')).toBeVisible();

    // Sort by due date and check order: B Task (sooner) should appear before A Task
    await page.selectOption('select[aria-label="Sort"]', 'due_date').catch(() => { });
    // Fallback: click visible select
    await page.locator('select').filter({ hasText: 'Due date' }).first().selectOption('due_date');

    // Wait a moment for list to update
    await page.waitForTimeout(500);

    const items = await page.locator('ul > li').allTextContents();
    expect(items[0]).toContain('B Task');
    expect(items[1]).toContain('A Task');
});
