const { BeforeAll, AfterAll, Before, After, AfterStep, Status } = require('@cucumber/cucumber');
const fs = require('fs');
const BrowserManager = require('../../utils/browserManager');
const TestUtils = require('../../utils/testUtils');
const ReportUtils = require('../../utils/reportUtils');
const PageFactory = require('../../utils/pageFactory');

let browser;

// --- Global before/after ---
BeforeAll(async function () {
  browser = await BrowserManager.launch();
  if (!browser) throw new Error('[hooks] Browser failed to launch');
  console.log('[hooks] Browser launched.');
});

AfterAll(async function () {
  await BrowserManager.close();
  console.log('[hooks] Browser closed.');
});

// --- Per-scenario lifecycle ---
Before(async function ({ pickle }) {
  this.pickle = pickle;

  const context = await BrowserManager.newContext();
  const traceMode = process.env.PW_TRACE || 'retain-on-failure';
  if (traceMode !== 'off') {
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  const page = await context.newPage();
  this.setBrowser(browser);
  this.setContext(context);
  this.setPage(page);

  const po = PageFactory.create(page);
  this.setPO(po);

  page.setDefaultTimeout(Number(process.env.PW_UI_TIMEOUT_MS || 10000));
  console.log(`[hooks] Scenario started: "${pickle?.name}"`);
});

// NOTE: Only one parameter here (no { attach })
AfterStep(async function ({ result }) {
  if (result?.status !== Status.FAILED) return;

  try {
    const filePath = await TestUtils.saveScreenshot(
      this.page,
      this.pickle?.name || 'scenario',
      process.env.PW_BROWSER || 'browser',
      'failed'
    );
    const attachFn = typeof this.attach === 'function' ? this.attach.bind(this) : null;
    if (attachFn) {
      await attachFn(fs.readFileSync(filePath), 'image/png');
    } else {
      console.warn('[hooks] this.attach not available in AfterStep – saved screenshot only:', filePath);
    }
  } catch (err) {
    console.warn('[hooks] AfterStep screenshot error:', err.message);
  }
});

// NOTE: Only one parameter here (no { attach })
After(async function (scenario) {
  const passed = scenario.result?.status === Status.PASSED;
  const browserName = process.env.PW_BROWSER || 'browser';

  try {
    const filePath = await TestUtils.saveScreenshot(
      this.page,
      scenario.pickle.name,
      browserName,
      passed ? 'passed' : 'failed'
    );
    const attachFn = typeof this.attach === 'function' ? this.attach.bind(this) : null;
    if (attachFn) {
      await attachFn(fs.readFileSync(filePath), 'image/png');
    } else {
      console.warn('[hooks] this.attach not available in After – saved screenshot only:', filePath);
    }
  } catch (err) {
    console.warn('[hooks] Scenario final screenshot error:', err.message);
  } finally {
    try {
      const traceMode = process.env.PW_TRACE || 'retain-on-failure';
      if (traceMode !== 'off') {
        const keepTrace = !passed || traceMode === 'on' || process.env.PW_KEEP_TRACE === 'true';
        const tracePath = await TestUtils.saveTrace(this.context, scenario.pickle.name, browserName, keepTrace);
        console.log(`[hooks] Trace ${keepTrace ? 'saved' : 'discarded'}${keepTrace ? `: ${tracePath}` : ''}`);
      }
    } catch (e) {
      console.warn('[hooks] Trace stop error:', e.message);
    }

    try {
      const keepVideoOnPass = process.env.PW_KEEP_VIDEO_ON_PASS === 'true';
      await TestUtils.cleanVideo(this.page, passed && keepVideoOnPass);
    } catch (_) {}

    try { await this.page?.close(); } catch (e) { console.warn('[hooks] Page close warn:', e.message); }
    try { await this.context?.close(); } catch (e) { console.warn('[hooks] Context close warn:', e.message); }

    console.log(`[hooks] Scenario finished: "${scenario.pickle?.name}" (${passed ? 'PASSED' : 'FAILED'})`);
  }
});

// Generate report on process exit
process.on('exit', () => {
  ReportUtils.generateHtmlReport();
});
