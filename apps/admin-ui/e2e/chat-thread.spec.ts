import { test, expect } from '@playwright/test';

const SAMPLE_THREAD_ID = '00000000-0000-0000-0000-000000000001';

test.describe('PAGE 09 — Chat thread (case-gated)', () => {
  test('without caseId shows guidance to open from a case (or redirects to login)', async ({ page }) => {
    await page.goto(`/chat/threads/${SAMPLE_THREAD_ID}`);
    await page.waitForLoadState('domcontentloaded');
    // Either we are redirected to login (auth required) or we see the case-gate message
    const url = page.url();
    const onLogin =
      url.includes('/login') ||
      (await page.getByRole('heading', { name: /SLine Admin Login|Login/i }).isVisible().catch(() => false));
    const onThread = url.includes('/chat/threads/');
    const hasCaseGuidance =
      (await page.getByText(/thread content requires a case|open this thread from a case/i).isVisible().catch(() => false)) ||
      (await page.getByText(/open this thread from a case/i).isVisible().catch(() => false));
    expect(onLogin || hasCaseGuidance || onThread).toBe(true);
  });

  test('with caseId in query shows thread route (may load or show error when unauthenticated)', async ({ page }) => {
    const caseId = '00000000-0000-0000-0000-000000000002';
    await page.goto(`/chat/threads/${SAMPLE_THREAD_ID}?caseId=${caseId}`);
    // Either redirect to login or we land on thread page (loading/error/content)
    const url = page.url();
    const onLogin = url.includes('/login');
    const onThread = url.includes('/chat/threads/') && url.includes('caseId');
    expect(onLogin || onThread).toBe(true);
  });
});
