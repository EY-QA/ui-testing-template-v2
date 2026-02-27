const { setWorldConstructor } = require('@cucumber/cucumber');
const TestUtils = require('../../utils/testUtils');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.po = {};
    this.shared = {};
    this.utils = TestUtils; // utilities (screenshots, traces, paths)
    // NOTE: this.attach is injected by Cucumber automatically after setWorldConstructor
  }

  setBrowser(browser) { this.browser = browser; }
  setContext(context) { this.context = context; }
  setPage(page) { this.page = page; }
  setPO(po) { this.po = po; }
}

setWorldConstructor(CustomWorld);