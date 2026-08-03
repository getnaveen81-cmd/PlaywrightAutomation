
/* to run tjis config file 
use this command in terminal to run 
-> npx playwright test ./tests/ClientAppPO.spec.js --config playwright.config1.js --project=safari */
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
        trace: "on",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
      },
    },
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        headless: true,
        trace: "on",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
      },
    },
  ],
};

module.exports = config;
