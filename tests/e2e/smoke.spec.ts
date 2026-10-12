import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { chapters } from '../../src/data/chapters';

/** Console errors, ignoring Vercel's analytics scripts (they only exist on Vercel). */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    // Vercel's analytics scripts only exist on Vercel, so they 404 locally and in CI.
    if (m.type() === 'error' && !/Failed to load resource|_vercel\//.test(m.text())) errors.push(m.text());
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && !r.url().includes('/_vercel/')) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}

/** Scroll through the page so lazy sections and in-view animations settle. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(2500);
}

test('home renders every chapter without errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Akshat');
  await scrollThrough(page);
  for (const c of chapters) await expect(page.locator(`#${c.id}`)).toBeAttached();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

for (const theme of ['dark', 'light'] as const) {
  test(`no axe violations (${theme})`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    await page.reload();
    await scrollThrough(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
  });
}

test('pause animations is persisted and announced', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Pause animations' });
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
});

test('toolkit tiles explain each tool', async ({ page }) => {
  await page.goto('/#toolkit');
  await scrollThrough(page);
  await page.locator('#toolkit').scrollIntoViewIfNeeded();
  // Tiles burst into place and then float, so wait for the burst before clicking.
  await page.waitForTimeout(2500);
  const tile = page.locator('#toolkit button[aria-pressed]', { hasText: 'LangChain' });
  await tile.click({ force: true });
  await expect(tile).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#toolkit [aria-live]')).toContainText('Deloitte');
});

test('résumé, robots, sitemap and OG image respond', async ({ request }) => {
  for (const path of ['/Akshat_Banga_Resume.pdf', '/robots.txt', '/sitemap.xml', '/opengraph-image']) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  expect((await request.get('/does-not-exist')).status()).toBe(404);
});
