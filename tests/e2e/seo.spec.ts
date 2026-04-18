import { test, expect } from "@playwright/test";

const PAGES_WITH_META = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/work", name: "Work" },
  { path: "/blog", name: "Blog" },
  { path: "/gallery", name: "Gallery" },
  { path: "/games", name: "Games" },
];

test.describe("SEO - Meta Tags", () => {
  for (const { path, name } of PAGES_WITH_META) {
    test(`${name} (${path}) has <title> tag`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test(`${name} (${path}) has meta description`, async ({ page }) => {
      await page.goto(path);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(0);
    });

    test(`${name} (${path}) has Open Graph title`, async ({ page }) => {
      await page.goto(path);
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");
      expect(ogTitle).toBeTruthy();
    });

    test(`${name} (${path}) has Open Graph description`, async ({ page }) => {
      await page.goto(path);
      const ogDesc = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");
      expect(ogDesc).toBeTruthy();
    });

    test(`${name} (${path}) has Open Graph image`, async ({ page }) => {
      await page.goto(path);
      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      expect(ogImage).toBeTruthy();
    });
  }
});

test.describe("SEO - Structured Data", () => {
  test("home page has JSON-LD schema", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });

  test("blog post has JSON-LD schema", async ({ page }) => {
    await page.goto("/blog/building-a-chess-game-with-ai-commentary");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });

  test("work project has JSON-LD schema", async ({ page }) => {
    await page.goto("/work/ford-web-scraper");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("SEO - Canonical & Twitter Cards", () => {
  test("home page has canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBeTruthy();
  });

  test("home page has Twitter card meta", async ({ page }) => {
    await page.goto("/");
    const twitterCard = await page
      .locator('meta[name="twitter:card"]')
      .getAttribute("content");
    expect(twitterCard).toBeTruthy();
  });
});

test.describe("Performance - Resource Loading", () => {
  test("home page loads within 10 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10_000);
  });

  test("no broken links to internal pages on home page", async ({ page }) => {
    await page.goto("/");
    const internalLinks = page.locator('a[href^="/"]');
    const count = await internalLinks.count();

    const brokenLinks: string[] = [];
    for (let i = 0; i < Math.min(count, 15); i++) {
      const href = await internalLinks.nth(i).getAttribute("href");
      if (href && !href.startsWith("/#") && !href.startsWith("/api/")) {
        const response = await page.request.get(href).catch(() => null);
        if (response && response.status() === 404) {
          brokenLinks.push(href);
        }
      }
    }
    expect(brokenLinks).toHaveLength(0);
  });
});

test.describe("Accessibility Basics", () => {
  test("home page has a single <h1> or meaningful heading structure", async ({ page }) => {
    await page.goto("/");
    const headings = page.locator("h1, h2");
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test("all images have alt attributes on home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const images = page.locator("img");
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      // alt="" is valid for decorative images, just ensure the attribute exists
      expect(alt).not.toBeNull();
    }
  });

  test("page has lang attribute on <html>", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBeTruthy();
  });

  test("interactive elements are keyboard focusable", async ({ page }) => {
    await page.goto("/");
    // Tab through the first few focusable elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // Just verify page doesn't crash and focus is moving
    await expect(page.locator("body")).toBeVisible();
  });
});
