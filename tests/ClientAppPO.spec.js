const { test, expect } = require('@playwright/test');
const { request } = require('node:http');
const { POManager } = require('../pageobjects/POManager');
 
 
 
test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const poManager = new POManager(page)
   const username = "anshika@gmail.com";
   const password ="Iamking@000"
   const productName = 'ZARA COAT 3';
   await page.route("**/*.{jpg,png,jpeg}", route=>route.abort())
   const products = page.locator(".card-body");

   const loginPage = poManager.getLoginPage()
   await loginPage.goto()
   await loginPage.validLogin(username,password)
   
   const dashboardPage = poManager.getDashboardPage()
   await dashboardPage.searchProductAddCart('ZARA COAT 3')
   await dashboardPage.navigateToCart()

   const cartPage = poManager.getCartpage()
   await cartPage.verifyProductIsDisplayed(productName)
   await cartPage.Checkout()

   const ordersReviewPage = poManager.getOrdersReviewPage()
   await ordersReviewPage.searchCountryAndSelect("ind","India")
   const orderId = await ordersReviewPage.SubmitAndGetOrderId()
   console.log(orderId)
   await dashboardPage.navigateToOrders()

   const ordersHistoryPage = poManager.getOrdersHistoryPage()
   ordersHistoryPage.searchOrderAndSelect(orderId)
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy()

 
});