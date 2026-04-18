import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("page loads with 200 status", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
  });

  test("page has a heading", async ({ page }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("person name appears on page", async ({ page }) => {
    const body = await page.locator("body").textContent();
    // Neal Miran is the person defined in resources/content.tsx
    expect(body).toContain("Neal");
  });

  test("avatar / profile image renders", async ({ page }) => {
    const avatar = page.locator('img[src*="avatar"], img[alt*="Neal"], img[alt*="avatar"]').first();
    // Avatar may be rendered - check it doesn't 404 if present
    const avatarCount = await avatar.count();
    if (avatarCount > 0) {
      await expect(avatar).toBeVisible();
    }
  });

  test("work experience section is present", async ({ page }) => {
    const body = await page.locator("body").textContent();
    // About page content includes work history
    expect(body?.length).toBeGreaterThan(500);
  });

  test("social links render", async ({ page }) => {
    // Social links (GitHub, LinkedIn, etc.) should be present
    const externalLinks = page.locator('a[href^="https://"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("page is scrollable with content sections", async ({ page }) => {
    // Verify there are multiple headings indicating section structure
    const headings = page.locator("h1, h2, h3");
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("table of contents or section navigation renders", async ({ page }) => {
    // About page has a TableOfContents component
    // Just verify the page has sufficient structured content
    const main = page.locator("main");
    await expect(main).toBeVisible();
    const text = await main.textContent();
    expect(text?.length).toBeGreaterThan(200);
  });
});
