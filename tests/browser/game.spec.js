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
    if (i === 1)
      await page.screenshot({
        path: `/tmp/office-feedback-${info.project.name}.png`,
        fullPage: true,
      });
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

test("固定的提前下班与明显加班路线，逐题显示反馈并保持最终时间一致", async ({
  page,
}) => {
  const { paths } = await import("../helpers.js");
  for (const name of ["earlyNormal", "burnout"]) {
    const path = paths[name];
    await page.goto("/");
    await page
      .locator(`input[value="${path.difficulty}"]`)
      .check({ force: true });
    await page.getByRole("button", { name: "打卡，开始今天" }).click();
    for (const [i, id] of path.choices.entries()) {
      await page.locator(`[data-option="${id}"]`).click();
      await expect(page.locator(".feedback")).toContainText("刚才发生了什么");
      await expect(page.locator(".feedback p")).not.toBeEmpty();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      if (i === 10) {
        const before = await page.locator(".feedback p").textContent();
        await page.reload();
        await page.getByRole("button", { name: "继续上次" }).click();
        await expect(page.locator(".feedback p")).toHaveText(before);
      }
    }
    await expect(
      page.locator(".result-numbers>div").first().locator("strong"),
    ).toHaveText(
      `${String(Math.floor(path.time / 60)).padStart(2, "0")}:${String(path.time % 60).padStart(2, "0")}`,
    );
    await expect(page.locator(".result-heading h1")).toContainText(
      name === "earlyNormal" ? "准点下班" : "工位续费",
    );
    await page.locator(".task-list summary").click();
    await expect(page.locator(".task-list")).toContainText("0 项待处理");
  }
});

test("升级旧局时保留卡牌并提示重新开局", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "office-escape-v2",
      JSON.stringify({
        version: 2,
        cards: ["first", "team"],
        runs: 2,
        endings: ["team"],
        session: { version: 2, turn: 8, runId: "legacy", history: [] },
      }),
    ),
  );
  await page.goto("/");
  await expect(page.locator(".warning")).toContainText("旧局已留档");
  await expect(page.locator("#resume")).toHaveCount(0);
  await page.locator("#nav-gallery").click();
  await expect(page.locator(".collected")).toHaveCount(2);
});
