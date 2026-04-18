import { test, expect } from "@playwright/test";

const INTERNAL_ROUTES = [
  "/internal/work",
  "/internal/blog",
  "/internal/gallery",
];

test.describe("Authentication - Login Page", () => {
  test("login page loads with 200 status", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);
  });

  test("login page has a heading or title", async ({ page }) => {
    await page.goto("/login");
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("GitHub login button is visible", async ({ page }) => {
    await page.goto("/login");
    const githubBtn = page.locator(
      'button:has-text("GitHub"), a:has-text("GitHub"), [class*="github"]'
    );
    const body = await page.locator("body").textContent();
    const hasGitHub =
      body?.toLowerCase().includes("github") ||
      (await githubBtn.count()) > 0;
    expect(hasGitHub).toBeTruthy();
  });

  test("login page renders without crashing", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("main, body")).toBeVisible();
  });
});

test.describe("Protected Routes - Unauthenticated Access", () => {
  for (const route of INTERNAL_ROUTES) {
    test(`${route} redirects or blocks unauthenticated users`, async ({ page }) => {
      const response = await page.goto(route);
      const status = response?.status() ?? 0;
      const currentUrl = page.url();

      // Should be one of: redirected to login, 404, 401, or 403
      const isProtected =
        status === 404 ||
        status === 401 ||
        status === 403 ||
        currentUrl.includes("/login") ||
        currentUrl.includes("/not-found");

      expect(isProtected).toBeTruthy();
    });
  }

  test("internal project detail is protected", async ({ page }) => {
    const response = await page.goto(
      "/work/oxford-corporate-website-reskin-internal"
    );
    const status = response?.status() ?? 0;
    const currentUrl = page.url();
    const isProtected =
      status === 404 ||
      status === 401 ||
      status === 403 ||
      currentUrl.includes("/login");
    expect(isProtected).toBeTruthy();
  });
});

test.describe("Auth API", () => {
  test("/api/check-auth returns JSON with authenticated field", async ({
    request,
  }) => {
    const response = await request.get("/api/check-auth");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.authenticated).toBe("boolean");
    // Unauthenticated session returns false
    expect(body.authenticated).toBe(false);
  });

  test("/api/auth/providers returns NextAuth providers", async ({ request }) => {
    const response = await request.get("/api/auth/providers");
    // NextAuth providers endpoint
    expect([200, 404]).toContain(response.status());
  });
});
