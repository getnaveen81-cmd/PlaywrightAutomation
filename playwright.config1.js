/* to run tjis config file 
use this command in terminal to run 
-> npx playwright test ./tests/ClientAppPO.spec.js --config playwright.config1.js --project=safari */

const { permission } = require("node:process");
const { devices } = require("playwright/test");

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = {
  testDir: "./tests", // Folder containing all Playwright test files
  retries:1, // Retry failed tests once
  reporter: "html", // Generate HTML report after test execution
  timeout: 30 * 1000, // Maximum time allowed for each test (30 seconds)
  expect: {
    timeout: 5 * 1000, // Maximum wait time for Playwright assertions
  },
  projects: [
    {
      name: "safari", // Project name
      use: {
        browserName: "webkit", // Launch WebKit browser (Safari)
        headless: true, // Run browser in headless mode (without UI)
        trace: "on",  // Records a trace for every test execution
        screenshot: "only-on-failure", // Capture screenshot only when a test fails
        video: "retain-on-failure",  // Record every test, but keep videos only for failed tests
        ...devices['iPhone 16 Pro Max'] // Emulates the iPhone 16 Pro Max device
      },
    },
    {
      name: "chrome", // Project name
      use: {
        browserName: "chromium", // Launch Chromium browser
        headless: true, // Run browser with UI
        trace: "on", // Records a trace for every test execution
        video: "retain-on-failure", // Record every test, but keep videos only for failed tests
        screenshot: "only-on-failure", // Capture screenshot only when a test fails
        video: "retain-on-failure", // Record every test, but keep videos only for failed tests
        ignoreHttpsErros:true, // Ignore SSL/HTTPS certificate errors
        Permissions:['geolocation'], // Grant geolocation permission
        // viewport : {width:720,height:720} // Override the default browser/device viewport size
      },
    },
  ],
};

module.exports = config;