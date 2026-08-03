const { test, expect } = require("@playwright/test");
const { request } = require("node:http");
const { POManager } = require("../pageobjects/POManager");
const dataset = JSON.parse(
  JSON.stringify(require("../utils/ClientAppPOTestData.json"))
);

for (const data of dataset) {
  test(`@Webst Client App login for ${data.productName}`, async ({ page }) => {
    const poManager = new POManager(page);

    // await page.route("**/*.{jpg,png,jpeg}", route=>route.abort())
    const products = page.locator(".card-body");

    const loginPage = poManager.getLoginPage();
    await loginPage.goto();
    await loginPage.validLogin(data.username, data.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartpage();
    await cartPage.verifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);
    await dashboardPage.navigateToOrders();

    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  });
}
