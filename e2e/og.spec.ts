import { expect, test } from "./fixtures";

const routes = ["/", "/arquivo", "/contato", "/sacola",
  ...["a", "b", "c"].map(id => `/drops/drop-de-exemplo-${id}`),
  ...Array.from({ length: 7 }, (_, i) => `/produtos/peca-de-exemplo-0${i + 1}`),
  "/inexistente"];

for (const path of routes) {
  test(`social preview: ${path}`, async ({ page, request, baseURL }) => {
    await page.goto(path);
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveCount(1);
    const url = new URL((await image.getAttribute("content"))!);
    expect(url.origin).toBe(baseURL);
    expect(url.pathname).toBe(`${path === "/" || path === "/inexistente" ? "" : path}/opengraph-image`);
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Slow Company/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", url.href);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", await page.title());
    const response = await request.get(url.href);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const png = await response.body();
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(5 * 1024 * 1024);
  });
}

test("unknown catalogue entries do not produce misleading social cards", async ({ request }) => {
  for (const path of ["/drops/inexistente/opengraph-image", "/produtos/inexistente/opengraph-image"]) {
    expect((await request.get(path)).status()).toBe(404);
  }
});
