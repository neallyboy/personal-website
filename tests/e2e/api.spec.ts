import { test, expect } from "@playwright/test";

test.describe("RSS Feed", () => {
  test("GET /api/rss returns 200", async ({ request }) => {
    const response = await request.get("/api/rss");
    expect(response.status()).toBe(200);
  });

  test("RSS feed returns valid XML", async ({ request }) => {
    const response = await request.get("/api/rss");
    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("<rss");
    expect(body).toContain("</rss>");
  });

  test("RSS feed contains blog post titles", async ({ request }) => {
    const response = await request.get("/api/rss");
    const body = await response.text();
    expect(body).toContain("<item>");
    expect(body).toContain("<title>");
  });

  test("RSS feed has correct content-type", async ({ request }) => {
    const response = await request.get("/api/rss");
    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/xml|rss/i);
  });
});

test.describe("Sitemap", () => {
  test("GET /sitemap.xml returns 200", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
  });

  test("sitemap contains public routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("<url>");
    expect(body).toContain("<loc>");
  });

  test("sitemap does not expose internal routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();
    expect(body).not.toContain("/internal/");
    expect(body).not.toContain("-internal");
  });
});

test.describe("Robots.txt", () => {
  test("GET /robots.txt returns 200", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
  });

  test("robots.txt has valid content", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();
    expect(body).toMatch(/User-agent/i);
  });

  test("robots.txt disallows internal routes", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const body = await response.text();
    // Internal routes should be disallowed
    expect(body.toLowerCase()).toMatch(/disallow.*internal|internal.*disallow/i);
  });
});

test.describe("OG Image Generation", () => {
  test("GET /api/og/generate returns an image", async ({ request }) => {
    const response = await request.get(
      "/api/og/generate?title=Test+Page"
    );
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/image/i);
  });

  test("OG image generates for home page title", async ({ request }) => {
    const response = await request.get(
      "/api/og/generate?title=Portfolio"
    );
    expect(response.status()).toBe(200);
  });
});

test.describe("Check Auth API", () => {
  test("GET /api/check-auth returns 200", async ({ request }) => {
    const response = await request.get("/api/check-auth");
    expect(response.status()).toBe(200);
  });

  test("returns JSON with authenticated boolean", async ({ request }) => {
    const response = await request.get("/api/check-auth");
    const json = await response.json();
    expect(typeof json.authenticated).toBe("boolean");
  });
});
