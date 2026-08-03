// @ts-check
import { defineConfig, devices, expect } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = {
  testDir: './tests',
  reporter: 'html',
  timeout : 30 * 1000,
  expect :{
    timeout : 5*1000
  },
  use: {
    browserName : 'chromium',
    headless : true,
    
    // Trace options: 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
    trace: 'on',
    
    // Screenshot options: 'on' | 'off' | 'only-on-failure'
    screenshot: 'only-on-failure',
    
    // Video options: 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
    video: 'retain-on-failure',
  }
};

module.exports = config ;

