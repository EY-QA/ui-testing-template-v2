const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');
const TestUtils = require('./testUtils');

class ReportUtils {
  /** Copy cucumber.json to per-run folder and generate HTML report */
  generateHtmlReport() {
    try {
      const sourceJson = path.join(process.cwd(), 'reports', 'cucumber.json');
      const destJson = path.join(TestUtils.reportsDir, 'report.json');
      const destHtml = path.join(TestUtils.reportsDir, 'report.html');

      if (!fs.existsSync(sourceJson)) {
        console.warn('⚠ No JSON found at reports/cucumber.json – skipping HTML report generation.');
        return;
      }

      fs.mkdirSync(TestUtils.reportsDir, { recursive: true });
      fs.copyFileSync(sourceJson, destJson);

      reporter.generate({
        theme: process.env.REPORT_THEME || 'bootstrap',
        jsonFile: destJson,
        output: destHtml,
        reportSuiteAsScenarios: true,
        launchReport: false,
        metadata: {
          Browser: process.env.PW_BROWSER || process.env.PW_BROWSER_CHANNEL || 'chromium',
          Channel: process.env.PW_BROWSER_CHANNEL || 'default',
          Platform: process.platform,
          Node: process.version,
          'Run ID': TestUtils.runId,
          'Run Timestamp': TestUtils.runTimestamp,
          Headless: String(
            process.env.HEADLESS === 'true'
              || (process.env.HEADLESS !== 'false' && !!process.env.CI)
              || false
          ),
        },
      });

      console.log(`📄 Cucumber HTML report: ${destHtml}`);
      console.log(`📦 Artifacts dir: ${TestUtils.artifactsDir}`);
    } catch (err) {
      console.error('❌ Report generation failed:', err);
    }
  }
}

module.exports = new ReportUtils();
