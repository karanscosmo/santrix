import { test, expect } from "@playwright/test";

test.describe("Sanktrix Platform Navigation & Core Flows", () => {
  test("should check landing page login and redirect to dashboard", async ({ page }) => {
    // Navigate to landing/login route
    await page.goto("/");

    // Verify title and page header elements
    await expect(page).toHaveTitle(/Sanktrix/);
    // Click static Login button in header to open the login modal
    await page.click("header button:has-text('Login')");

    // Wait for the modal form to be rendered and submit it
    const loginForm = page.locator("form");
    await loginForm.waitFor({ state: "attached", timeout: 5000 });
    await loginForm.evaluate(form => (form as HTMLFormElement).requestSubmit());

    // Check redirection to dashboard path
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator("h2:has-text('Revenue Forecast')")).toBeVisible();
  });

  test("should verify sidebar navigation routes are clickable and active", async ({ page }) => {
    // Direct dashboard entry
    await page.goto("/dashboard");

    // Click on Executive Copilot link in sidebar
    await page.click("a:has-text('Executive Copilot')");
    await expect(page).toHaveURL(/\/copilot/);

    // Click on Wolfram Center link in sidebar
    await page.click("a:has-text('Wolfram Center')");
    await expect(page).toHaveURL(/\/wolfram/);

    // Click on Settings page
    await page.click("a:has-text('Settings')");
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.locator("h3:has-text('Alerts Center')")).toBeVisible();

    // Click on Security Gate page
    await page.click("a:has-text('Security Gate')");
    await expect(page).toHaveURL(/\/security/);
    await expect(page.locator("h2:has-text('Security & Governance Center')")).toBeVisible();
  });
});
