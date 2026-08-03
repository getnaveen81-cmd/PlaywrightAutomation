
/* to run tjis config file 
use this command in terminal to run 
-> npx playwright test ./tests/ClientAppPO.spec.js --config playwright.config1.js --project=safari */

const { permission } = require("node:process");
const { devices } = require("playwright/test");

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = {
  testDir: "./tests",
  reporter: "html",
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  projects: [
    {
      name: "safari",
      use: {
        browserName: "webkit",
        headless: true,
        trace: "on",  // Records a trace for every test execution
        screenshot: "only-on-failure", // Capture screenshot only when a test fails
        video: "retain-on-failure",  // Record every test, but keep videos only for failed tests
        ...devices['iPhone 16 Pro Max'] // Emulates the iPhone 16 Pro Max device
      },
    },
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        headless: false,
        trace: "on",
        video: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        ignoreHttpsErros:true, // Ignores SSL/HTTPS certificate errors
        Permissions:['geolocation'], 
        viewport : {width:720,height:720} // Overrides the default device viewport size
      },
    },
  ],
};

module.exports = config;
