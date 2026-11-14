import { test, expect } from "@playwright/test";
test("完整18题、刷新续玩、排名、图鉴和分享", async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page).toHaveTitle("今天必须准时下班");
  await expect(
    page.getByRole("heading", { name: "今天必须 准时下班。" }),
  ).toBeVisible();
  await page.screenshot({
    path: `/tmp/office-home-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "打卡，开始今天" }).click();
  for (let i = 0; i < 18; i++) {
    await expect(page.locator(".turn-count b")).toHaveText(String(i + 1));
    await expect(page.locator(".stages .active")).toContainText(
      i < 4
        ? "收尾冲刺"
        : i < 9
          ? "临时加戏"
          : i < 14
            ? "下班拉锯"
            : "最后一公里",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    if (i === 8) {
      await page.reload();
      await page.getByRole("button", { name: "继续上次" }).click();
      await expect(page.locator(".turn-count b")).toHaveText("9");
    }
    if (i === 0)
      await page.screenshot({
        path: `/tmp/office-play-${info.project.name}.png`,
        fullPage: true,
      });
    await page
      .locator("[data-choice]:not([disabled])")
      .nth(i % 2)
      .click();
  }
  await expect(page.locator(".rank-row")).toHaveCount(5);
  await expect(page.locator(".result-heading h1")).toBeVisible();
  await page.screenshot({
    path: `/tmp/office-result-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "复制战绩" }).click();
  await expect(page.locator("#share-notice")).toContainText(/战绩|文字/);
  await page.getByRole("button", { name: "查看完整图鉴" }).click();
  await expect(page.locator(".card")).toHaveCount(14);
  expect(await page.locator(".collected").count()).toBeGreaterThan(0);
  await page.reload();
  await page.locator("#nav-gallery").click();
  expect(await page.locator(".collected").count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
test("四档难度均能在界面通关", async ({ page }) => {
  for (const d of ["easy", "normal", "hard", "hell"]) {
    await page.goto("/");
    await page.locator(`input[value="${d}"]`).check({ force: true });
    await page.getByRole("button", { name: "打卡，开始今天" }).click();
    for (let i = 0; i < 18; i++)
      await page.locator("[data-choice]:not([disabled])").first().click();
    await expect(page.locator(".rank-row")).toHaveCount(5);
  }
});
