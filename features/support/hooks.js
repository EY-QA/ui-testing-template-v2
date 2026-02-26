require('dotenv').config();
const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
const { chromium, firefox, webkit, selectors } = playwright;
const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');

const TestPage = require('../../pages/testpage.page');

selectors.setTestIdAttribute('data-test');
setDefaultTimeout(10_000);
let browser;
let RUN_FOLDER = null; // screenshots run folder

BeforeAll(async function () {
  const channel = process.env.PW_BROWSER_CHANNEL || 'chromium'; // default to Edge
  const headless = false; //using headless browser

  console.log(`[hooks] Launching Playwright with channel=${channel}, headless=${headless}`);
  browser = await chromium.launch({ channel, headless });
});

Before(async function () {
  if (!browser) throw new Error('Playwright browser not initialized in BeforeAll.');
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: process.env.BASE_URL });
  this.page = await this.context.newPage();

// BEST PLACE to create your Page Object
  this.testPage = new TestPage(this.page);
  
});
After(async function (scenario) {
  try {
    if (!RUN_FOLDER) {
      const ts = new Date()
        .toLocaleString("en-CA", { hour12: false })
        .replace(", ", "_")
        .replace(/:/g, "-");

      const root = path.join(process.cwd(), "screenshots");
      RUN_FOLDER = path.join(root, ts);

      fs.mkdirSync(path.join(RUN_FOLDER, "passed"), { recursive: true });
      fs.mkdirSync(path.join(RUN_FOLDER, "failed"), { recursive: true });

      console.log("📁 Screenshots folder:", RUN_FOLDER);
    }

    const status = scenario.result.status.toLowerCase() === "passed" ? "passed" : "failed";
    const target = path.join(RUN_FOLDER, status);

    const scenarioName = scenario.pickle.name.replace(/[^a-z0-9_-]/gi, "_");
    const browserName = (process.env.BROWSER_NAME || "browser").replace(/[^a-z0-9_-]/gi, "_");

    const base = `${scenarioName}_${browserName}_`;

    let counter = 1;
    let fileName = `${base}${counter}.png`;
    let filePath = path.join(target, fileName);

    while (fs.existsSync(filePath)) {
      counter++;
      fileName = `${base}${counter}.png`;
      filePath = path.join(target, fileName);
    }

    await this.page.screenshot({ path: filePath, fullPage: true });
    console.log(`📸 Saved: ${filePath}`);
  } catch (err) {
    console.warn("Screenshot error:", err.message);
  } finally {
    try { await this.page?.close(); } catch {}
    try { await this.context?.close(); } catch {}
  }
});   

AfterAll(async function () {
  if (browser) {
    try {
      await browser.close();
    } catch (e) {
      console.warn("Warning: failed to close browser:", e.message);
    }
  }
});

process.on('exit', () => {
  try {
    const ts = new Date()
      .toLocaleString("en-CA", { hour12: false })
      .replace(", ", "_")
      .replace(/:/g, "-");

    const reportDir = path.join(process.cwd(), "reports", ts);
    fs.mkdirSync(reportDir, { recursive: true });

    const sourceJson = path.join(process.cwd(), "reports", "cucumber.json");
    const destJson = path.join(reportDir, "report.json");
    const destHtml = path.join(reportDir, "report.html");

    if (fs.existsSync(sourceJson)) {
      fs.copyFileSync(sourceJson, destJson);
    } else {
      console.warn('⚠ No JSON found at reports/cucumber.json');
      return;
    }

    reporter.generate({
      theme: "bootstrap",
      jsonFile: destJson,
      output: destHtml,
      reportSuiteAsScenarios: true,
      launchReport: false,
      metadata: {
        Browser: process.env.PW_BROWSER_CHANNEL || "chromium",
        Platform: process.platform,
        Node: process.version,
        "Run Timestamp": ts,
      },
    });

    console.log(`📄 Report generated at: ${destHtml}`);

  } catch (err) {
    console.error("❌ Report generation failed:", err);
  }
});

//   if (browser) {
//     try {
//       await browser.close();   // all Playwright work done
//     } catch (e) {
//       console.warn("Warning: failed to close browser in AfterAll:", e.message);
//     }
//   }

//   const ts = new Date()
//     .toLocaleString("en-CA", { hour12: false })
//     .replace(", ", "_")
//     .replace(/:/g, "-");

//   const reportDir = path.join(process.cwd(), "reports", ts);
//   fs.mkdirSync(reportDir, { recursive: true });

//   // 👉 Use the exact same JSON that Cucumber writes (as configured in cucumber.js)
//   const sourceJson = path.join(process.cwd(), "reports", "cucumber.json");

//   // Only the HTML goes into the timestamped folder
//   const destHtml = path.join(reportDir, "report.html");

//   if (!fs.existsSync(sourceJson)) {
//     console.warn('⚠ No JSON report found at reports/cucumber.json. Make sure cucumber.js has "json:reports/cucumber.json".');
//   } else {
//     // (Optional) Synchronous sanity check to avoid parsing an empty file
//     const buf = fs.readFileSync(sourceJson);
//     if (!buf || buf.length === 0) {
//       console.warn("⚠ JSON file exists but is empty. Report generation skipped.");
//     } else {
//       reporter.generate({
//         theme: "bootstrap",
//         jsonFile: sourceJson,     // 🔴 read directly from the source JSON (no copy)
//         output: destHtml,         // 🟢 write HTML to timestamped folder
//         reportSuiteAsScenarios: true,
//         launchReport: false,
//         metadata: {
//           Browser: process.env.PW_BROWSER_CHANNEL || "chromium",
//           Platform: process.platform,
//           Node: process.version,
//           "Run Timestamp": ts,
//         },
//       });
//       console.log(`📄 Cucumber HTML Report generated at: ${destHtml}`);
//     }
//   }
// });


