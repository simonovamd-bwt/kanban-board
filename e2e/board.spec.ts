import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Kanban Board' })).toBeVisible();
  });

  test('should display the board with columns and cards', async ({ page }) => {
    const columns = ['To Do', 'In Progress', 'Review', 'Testing', 'Done'];
    for (const columnName of columns) {
      await expect(page.getByRole('heading', { name: columnName, level: 2 })).toBeVisible();
    }

    await expect(page.getByText('Design user interface')).toBeVisible();
  });

  test('should add a new card to a column', async ({ page }) => {
    const addCardButton = page.getByRole('button', { name: /add card/i }).first();
    await addCardButton.click();

    const form = page.locator('form').filter({ has: page.getByPlaceholder('Card title') });
    await form.getByPlaceholder('Card title').fill('New Test Card');
    await form.getByPlaceholder('Card details').fill('This is a test card');
    await form.getByRole('button', { name: 'Add Card' }).click();

    await expect(page.getByText('New Test Card')).toBeVisible();
    await expect(page.getByText('This is a test card')).toBeVisible();
  });

  test('should delete a card', async ({ page }) => {
    const cardTitle = 'Design user interface';
    await expect(page.getByText(cardTitle)).toBeVisible();

    await page.getByRole('button', { name: `Delete ${cardTitle}` }).click();

    await expect(page.getByText(cardTitle)).not.toBeVisible();
  });

  test('should rename a column', async ({ page }) => {
    await page.getByRole('heading', { name: 'To Do', level: 2 }).click();

    const input = page.locator('input').first();
    await input.fill('New Column Name');
    await input.press('Enter');

    await expect(page.getByRole('heading', { name: 'New Column Name', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'To Do', level: 2 })).not.toBeVisible();
  });

  test('should move a card between columns using drag and drop', async ({ page }) => {
    const cardTitle = 'Design user interface';
    const card = page.getByText(cardTitle).first();
    const targetColumn = page.getByRole('heading', { name: 'In Progress', level: 2 }).locator('xpath=ancestor::div[contains(@class, "rounded-lg")]');

    const cardBox = await card.boundingBox();
    const targetBox = await targetColumn.boundingBox();

    if (!cardBox || !targetBox) {
      throw new Error('Could not find card or target column bounding boxes');
    }

    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
    await page.mouse.up();

    await expect(page.getByRole('heading', { name: 'In Progress', level: 2 }).locator('xpath=ancestor::div[contains(@class, "rounded-lg")]').getByText(cardTitle)).toBeVisible();
  });

  test('should cancel adding a card', async ({ page }) => {
    const addCardButton = page.getByRole('button', { name: /add card/i }).first();
    await addCardButton.click();

    await page.getByPlaceholder('Card title').fill('Test Card');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByText('Test Card')).not.toBeVisible();
    await expect(addCardButton).toBeVisible();
  });

  test('should not add card with empty title', async ({ page }) => {
    const addCardButton = page.getByRole('button', { name: /add card/i }).first();
    await addCardButton.click();

    const form = page.locator('form').filter({ has: page.getByPlaceholder('Card title') });
    await form.getByPlaceholder('Card details').fill('Details only');
    await form.getByRole('button', { name: 'Add Card' }).click();

    await expect(form.getByPlaceholder('Card title')).toBeVisible();
  });
});
