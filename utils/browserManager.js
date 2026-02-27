const { chromium, firefox, webkit, devices, selectors } = require('playwright');

selectors.setTestIdAttribute('data-test');

class BrowserManager {
  constructor() {
    this.browser = null;
  }

  /** Launch a Playwright browser based on env config */
  async launch() {
    const browserName = (process.env.PW_BROWSER || process.env.BROWSER_NAME || 'chromium').toLowerCase();
    const channel = process.env.PW_BROWSER_CHANNEL || undefined;
    const headless =
      process.env.HEADLESS === 'true'
      || (process.env.HEADLESS !== 'false' && !!process.env.CI)
      || false;

    let type = chromium;
    if (browserName === 'firefox') type = firefox;
    if (browserName === 'webkit') type = webkit;

    this.browser = await type.launch({
      headless,
      channel,
      slowMo: Number(process.env.PW_SLOWMO || (process.env.CI ? 0 : 0)) || undefined,
    });

    return this.browser;
  }

  /** Create a new browser context with base settings and optional device emulation */
  async newContext() {
    if (!this.browser) await this.launch();

    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const recordVideo = process.env.PW_VIDEO === 'true' || process.env.CI
      ? { dir: require('./testUtils').videosDir, size: { width: 1280, height: 720 } }
      : undefined;

    const context = await this.browser.newContext({
      baseURL,
      ignoreHTTPSErrors: process.env.PW_IGNORE_HTTPS_ERRORS === 'true',
      viewport: { width: 1440, height: 900 },
      locale: process.env.PW_LOCALE || 'en-US',
      colorScheme: process.env.PW_COLOR_SCHEME || 'light',
      ...(process.env.PW_DEVICE ? devices[process.env.PW_DEVICE] : {}),
      recordVideo,
    });

    return context;
  }

  /** Close the underlying browser */
  async close() {
    if (!this.browser) return;
    try { await this.browser.close(); } catch (e) { /* no-op */ }
    this.browser = null;
  }
}

module.exports = new BrowserManager();