// ============================================================================
// API UTILITY CLASS - Reusable helper for API calls in Playwright tests
// ============================================================================
// PURPOSE: Separates API logic from tests (like Page Object Model but for APIs)
// BENEFIT: If API changes, update only this file - not every test
// ============================================================================

class APiUtils {

  // CONSTRUCTOR: Called when you create new APiUtils(apiContext, loginPayLoad)
  // Stores dependencies for use in methods below
  // `this` = current instance of the class
  constructor(apiContext,loginPayLoad){
    this.apiContext = apiContext       // Playwright's HTTP client for API calls
    this.loginPayLoad = loginPayLoad   // Login credentials {userEmail, userPassword}
  }

  // ============================================================================
  // getToken() - Logs in via API and returns JWT authentication token
  // ============================================================================
  // JWT TOKEN: String that proves you're logged in - send it in headers for auth
  // ASYNC: Returns Promise - must use `await` when calling
  async getToken() {
    // POST request to login endpoint - sends credentials in request body
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.loginPayLoad,  // Request body - automatically converted to JSON
      }
    );

    const loginResponseJson = await loginResponse.json();  // Parse JSON response
    const token = loginResponseJson.token;  // Extract token from {token: "eyJ..."}
    console.log(token);
    return token;  // Return token for use in authenticated requests
  }

  // ============================================================================
  // createOrder() - Gets token + creates order, returns {token, orderId}
  // ============================================================================
  // FLOW: 1) Call getToken() to authenticate
  //       2) Use token to make authenticated order request
  //       3) Return both token and orderId for test to use
  async createOrder(orderPayload) {
    const response = {}  // Object to hold multiple return values
    response.token = await this.getToken()  // Step 1: Get auth token
    // Step 2: Create order with authenticated POST request
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,  // Order details: {orders: [{country, productOrderedId}]}
        headers: {
           Authorization: response.token,  // Auth header - proves we're logged in
          "content-type": "application/json",  // Tells server we're sending JSON
        },
      }
    );
    const orderResponseJson = await orderResponse.json()  // Parse response
    const orderId = orderResponseJson.orders[0]  // Extract order ID from array
    console.log(orderId)
    response.orderId = orderId  // Add orderId to response object
    return response  // Return {token, orderId} for test to use
  }
}

// MODULE EXPORT: Makes class available to other files
// Import syntax: const { APiUtils } = require('./utils/APiUtils')
module.exports = {APiUtils}
