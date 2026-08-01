// ============================================================================
// PLAYWRIGHT API + UI HYBRID TEST
// ============================================================================
// PATTERN: Use API for fast setup, UI for user-facing verification
// FLOW: Login via API → Create order via API → Verify order appears in UI
// WHY: API calls are faster & more reliable than clicking through UI
// ============================================================================

// Import Playwright test utilities
const { test, expect, request } = require('@playwright/test')
// Import our custom API utility class
const {APiUtils}  = require('../utils/APiUtils')

// TEST DATA - Payloads for API requests
const loginPayLoad = {userEmail: "getnaveen81@gmail.com", userPassword: "Rahulshetty@1234"}  // Login credentials
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]}  // Order details
let response;  // Will hold {token, orderId} from API - accessible across tests


// ============================================================================
// beforeAll HOOK - Runs ONCE before all tests in this file
// ============================================================================
// Use for: One-time setup (login, create test data)
// vs beforeEach: Runs before EACH test (reset state)
test.beforeAll( async()=>{
// Create API context - Playwright's HTTP client for making API calls
// ignoreHTTPSErrors: true - Skip SSL cert validation (for test environments)
const apiContext = await request.newContext({ ignoreHTTPSErrors: true})
// Create instance of our API utility class
const apiUtils = new APiUtils(apiContext,loginPayLoad)
// Call createOrder() which: 1) logs in → 2) creates order → 3) returns {token, orderId}
response =  await apiUtils.createOrder(orderPayload)


})




// ============================================================================
// TEST: Verify order created via API appears in the UI
// ============================================================================
test('Place the order',async({page})=>{

// INJECT TOKEN INTO BROWSER - Bypass UI login
// addInitScript() runs JS code BEFORE the page loads any scripts
// We set token in localStorage so app thinks we're already logged in
await page.addInitScript(value => {
    window.localStorage.setItem('token',value)
}, response.token)  // Pass token as the 'value' parameter

// Navigate to app (already authenticated via token injection)
await page.goto('https://rahulshettyacademy.com/client/')
// Click My Orders link - [routerlink] is Angular's routing attribute
await page.locator("[routerlink='/dashboard/myorders']").click()
// Wait for table to load before interacting
await page.locator('tbody').waitFor()
// Get all order rows from the table
const rows = await page.locator("tbody tr")

// Loop through rows to find our order
for(let i=0; i < await rows.count();i++){
    const rowOrderId = await rows.nth(i).locator('th').textContent()  // Get order ID from row
    if(response.orderId.includes(rowOrderId)){  // Check if this is our order
        await rows.nth(i).locator('button').first().click()  // Click View button
        break;  // Exit loop - found our order
    }
}

// VERIFY: Order ID on details page matches what we created via API
const orderIdDetails = await page.locator(".col-text").textContent()
await expect(response.orderId.includes(orderIdDetails)).toBeTruthy()  // Assertion

})