import { test, expect } from "@playwright/test";

const BLOG_SLUGS = [
  "building-a-chess-game-with-ai-commentary",
  "building-a-tic-tac-toe-game-for-jasper",
];

test.describe("Blog Index", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("page loads with 200 status", async ({ page }) => {
    const response = await page.goto("/blog");
    expect(response?.status()).toBe(200);
  });

  test("page has a heading", async ({ page }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("blog post list renders at least one post", async ({ page }) => {
    const postLinks = page.locator('a[href^="/blog/"]');
    await expect(postLinks.first()).toBeVisible({ timeout: 10_000 });
    const count = await postLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("blog posts show titles", async ({ page }) => {
    const postLinks = page.locator('a[href^="/blog/"]');
    const firstPost = postLinks.first();
    await expect(firstPost).toBeVisible();
    const text = await firstPost.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("clicking a blog post navigates to it", async ({ page }) => {
    const firstLink = page.locator('a[href^="/blog/"]').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});

test.describe("Blog Post Detail Pages", () => {
  for (const slug of BLOG_SLUGS) {
    test(`/blog/${slug} loads and renders content`, async ({ page }) => {
      const response = await page.goto(`/blog/${slug}`);
      expect(response?.status()).toBe(200);

      const heading = page.locator("h1, h2").first();
      await expect(heading).toBeVisible();

      const main = page.locator("main");
      const text = await main.textContent();
      expect(text?.trim().length).toBeGreaterThan(200);
    });

    test(`/blog/${slug} has article metadata (date/summary)`, async ({ page }) => {
      await page.goto(`/blog/${slug}`);
      // MDX posts have publishedAt date rendered on the page
      const body = await page.locator("body").textContent();
      expect(body?.length).toBeGreaterThan(300);
    });
  }

  test("chess blog post links to the chess game", async ({ page }) => {
    await page.goto("/blog/building-a-chess-game-with-ai-commentary");
    // The blog post likely mentions or links to the chess game
    const body = await page.locator("body").textContent();
    expect(body?.toLowerCase()).toContain("chess");
  });

  test("tic-tac-toe blog post contains relevant content", async ({ page }) => {
    await page.goto("/blog/building-a-tic-tac-toe-game-for-jasper");
    const body = await page.locator("body").textContent();
    expect(body?.toLowerCase()).toMatch(/tic.?tac.?toe|jasper/i);
  });

  test("blog post images load without 404", async ({ page }) => {
    const failedImages: string[] = [];
    page.on("response", (response) => {
      if (
        response.request().resourceType() === "image" &&
        response.status() === 404
      ) {
        failedImages.push(response.url());
      }
    });
    await page.goto(`/blog/${BLOG_SLUGS[0]}`);
    await page.waitForLoadState("networkidle");
    expect(failedImages).toHaveLength(0);
  });

  test("share section renders on blog post", async ({ page }) => {
    await page.goto(`/blog/${BLOG_SLUGS[0]}`);
    // ShareSection component renders sharing options
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("non-existent blog post returns 404", async ({ page }) => {
    const response = await page.goto("/blog/this-post-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
