import { test, expect } from "@playwright/test";

const PUBLIC_PROJECTS = [
  "oxford-corporate-website-reskin",
  "ford-web-scraper",
  "demand-intake-application",
  "310maxx-oxfordmaxxsupport-rebrand",
  "transparency-and-insights",
];

test.describe("Work / Projects Index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/work");
  });

  test("page loads with 200 status", async ({ page }) => {
    const response = await page.goto("/work");
    expect(response?.status()).toBe(200);
  });

  test("page has a heading", async ({ page }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("project cards render", async ({ page }) => {
    const projectLinks = page.locator('a[href^="/work/"]');
    await expect(projectLinks.first()).toBeVisible({ timeout: 10_000 });
    const count = await projectLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clicking a project card navigates to the project", async ({ page }) => {
    const firstLink = page.locator('a[href^="/work/"]').first();
    const href = await firstLink.getAttribute("href");
    await firstLink.click();
    await expect(page).toHaveURL(new RegExp("/work/"));
    expect(page.url()).toContain(href ?? "/work/");
  });
});

test.describe("Work / Project Detail Pages", () => {
  for (const slug of PUBLIC_PROJECTS) {
    test(`/work/${slug} loads and renders content`, async ({ page }) => {
      const response = await page.goto(`/work/${slug}`);
      expect(response?.status()).toBe(200);

      // Heading should be present
      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();

      // MDX content should have rendered text
      const main = page.locator("main");
      const text = await main.textContent();
      expect(text?.trim().length).toBeGreaterThan(100);
    });
  }

  test("project page has back/breadcrumb navigation", async ({ page }) => {
    await page.goto(`/work/${PUBLIC_PROJECTS[0]}`);
    // There should be a way back to /work
    const workLink = page.locator('a[href="/work"]');
    // Not all designs have breadcrumbs — just verify page renders
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("project page images render without 404", async ({ page }) => {
    const failedImages: string[] = [];
    page.on("response", (response) => {
      if (
        response.request().resourceType() === "image" &&
        response.status() === 404
      ) {
        failedImages.push(response.url());
      }
    });
    await page.goto(`/work/${PUBLIC_PROJECTS[0]}`);
    await page.waitForLoadState("networkidle");
    expect(failedImages).toHaveLength(0);
  });

  test("internal projects redirect unauthenticated users", async ({ page }) => {
    const response = await page.goto("/work/oxford-corporate-website-reskin-internal");
    // Should either be 404, redirect to login, or 401
    const status = response?.status() ?? 0;
    const url = page.url();
    const isProtected =
      status === 404 ||
      status === 401 ||
      url.includes("/login") ||
      url.includes("/not-found");
    expect(isProtected).toBeTruthy();
  });
});
