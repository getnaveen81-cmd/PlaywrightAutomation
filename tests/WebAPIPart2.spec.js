// ============================================================================
// PLAYWRIGHT SESSION STORAGE / STATE MANAGEMENT TEST
// ============================================================================
// PATTERN: Login once, save session state, reuse across multiple tests
// KEY CONCEPT: storageState - saves cookies/localStorage to a JSON file
// BENEFIT: Login UI only runs once, all tests reuse the authenticated session
// This is different from API token injection - here we use browser session
// ============================================================================

const { test, expect } = require('@playwright/test')
let webContext;  // Will hold browser context with saved login state

// ============================================================================
// beforeAll HOOK - Login once and save session state
// ============================================================================
// NOTE: This hook receives {browser} instead of {page}
// We need browser to create contexts and save storage state
test.beforeAll( async({browser})=>{
    // Create a new browser context (like an incognito window)
    const context = await browser.newContext()
    // Create a new page in that context
    const page = await context.newPage()
    
    // PERFORM UI LOGIN - This runs only once for all tests
    await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill('getnaveen81@gmail.com');
   await page.locator("#userPassword").fill("Rahulshetty@1234");
   await page.locator("[value='Login']").click();
   
   // Wait for page to fully load (no network activity)
   // networkidle = no network requests for 500ms
   await page.waitForLoadState('networkidle');
   
   // ============================================================================
   // SAVE SESSION STATE TO FILE
   // ============================================================================
   // storageState() captures: cookies, localStorage, sessionStorage
   // Saves to 'state.json' file - can be reused by other contexts
   await context.storageState({path : 'state.json'})
   
   // CREATE NEW CONTEXT WITH SAVED STATE
   // This context is pre-authenticated - no need to login again!
   // All tests will use this webContext
   webContext = await browser.newContext({storageState : 'state.json'})
})

// ============================================================================
// TEST 1: Full E2E - Add to cart, checkout, verify order
// ============================================================================
test('@API place the order', async()=>{

   const email = "getnaveen81@gmail.com";
   const productName = 'ZARA COAT 3';
   
   // Create page from webContext - ALREADY LOGGED IN (no login needed!)
   const page =  await webContext.newPage()
    await page.goto("https://rahulshettyacademy.com/client");
    
   // Get all product cards
   const products = page.locator(".card-body");
   // Wait for products to load
   await page.locator(".card-body b").first().waitFor();
   // Get all product titles (for debugging)
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   
   // LOOP THROUGH PRODUCTS - Find and add specific product to cart
   const count = await products.count();
   for (let i = 0; i < count; ++i) {
      if (await products.nth(i).locator("b").textContent() === productName) {
         //add to cart
         await products.nth(i).locator("text= Add To Cart").click();
         break;
      }
   }
 
   // Navigate to cart
   await page.locator("[routerlink*='cart']").click();
   //await page.pause();
 
   // Wait for cart items to load and verify product is in cart
   await page.locator("div li").first().waitFor();
   const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   expect(bool).toBeTruthy();
   
   // Proceed to checkout
   await page.locator("text=Checkout").click();
 
   // ============================================================================
   // COUNTRY DROPDOWN - Autocomplete/typeahead handling
   // ============================================================================
   // pressSequentially() types characters one by one with delay
   // This triggers the autocomplete dropdown (unlike fill() which is instant)
  await page.getByPlaceholder('Select Country').pressSequentially("ind", { delay: 150 }) 
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   
   // Loop through dropdown options to find "India"
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }
 
   // Verify email is displayed correctly
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   
   // Submit order
   await page.locator(".action__submit").click();
   
   // Verify success message
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   
   // Capture order ID for verification
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);
 
   // ============================================================================
   // VERIFY ORDER IN ORDER HISTORY
   // ============================================================================
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
   // Find our order in the table and click to view details
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   
   // Final assertion: order details page shows correct order ID
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
 
})

// ============================================================================
// TEST 2: Demonstrates session reuse - Already logged in!
// ============================================================================
// This test uses the same webContext, so it's already authenticated
// No need to login again - storageState handles it
test('test case 2', async()=>{
    const email = "";
   const productName = 'ZARA COAT 3';
   
   // New page from webContext - pre-authenticated!
   const page =  await webContext.newPage()
    await page.goto("https://rahulshettyacademy.com/client");
   const products = page.locator(".card-body");
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles);
})