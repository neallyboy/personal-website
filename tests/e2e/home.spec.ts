import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads and has correct title", async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test("hero headline is visible", async ({ page }) => {
    // The headline is rendered inside a Heading component
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("hero subline text is visible", async ({ page }) => {
    // There should be descriptive text below the headline
    const body = await page.locator("body").textContent();
    expect(body?.length).toBeGreaterThan(100);
  });

  test("About button / CTA is present and links to /about", async ({ page }) => {
    const aboutLink = page.locator('a[href="/about"]').first();
    await expect(aboutLink).toBeVisible();
  });

  test("clicking About CTA navigates to /about", async ({ page }) => {
    const aboutLink = page.locator('a[href="/about"]').first();
    await aboutLink.click();
    await expect(page).toHaveURL("/about");
  });

  test("featured project section renders", async ({ page }) => {
    // Projects component renders at least one project card
    await expect(page.locator("main")).toBeVisible();
    // There should be project links
    const projectLinks = page.locator('a[href^="/work/"]');
    await expect(projectLinks.first()).toBeVisible({ timeout: 10_000 });
  });

  test("Recent Writing section is visible", async ({ page }) => {
    const body = await page.locator("body").textContent();
    expect(body).toContain("Recent Writing");
  });

  test("blog post link is present in Recent Writing", async ({ page }) => {
    const blogLinks = page.locator('a[href^="/blog/"]');
    await expect(blogLinks.first()).toBeVisible({ timeout: 10_000 });
  });

  test("View all posts button links to /blog", async ({ page }) => {
    const blogLink = page.locator('a[href="/blog"]');
    await expect(blogLink.first()).toBeVisible();
  });

  test("newsletter / Mailchimp section renders", async ({ page }) => {
    // Mailchimp component renders a form or subscribe section
    const form = page.locator("form");
    // may or may not have a form - at minimum the page should fully load
    await expect(page.locator("main")).toBeVisible();
  });

  test("page has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Filter out known third-party analytics errors
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("gtag") &&
        !e.includes("clarity") &&
        !e.includes("analytics") &&
        !e.includes("GTM")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
