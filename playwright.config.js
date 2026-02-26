// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL,        // ussing value from .env
    testIdAttribute: 'data-test',         // testIdAttribute is used for locator getByTestId 
    headless: false,
    actionTimeout: 0,                     // no limit for actions
    trace: 'on-first-retry',              // collect traces on first retry
    screenshot: 'only-on-failure',        // after every run 
    video: 'retain-on-failure'
  },
});

