const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class TestUtils {
  constructor() {
    this.rootDir = process.cwd();

    // Unique RUN ID with timestamp + optional Git SHA
    this.runTimestamp = new Date()
      .toLocaleString('en-CA', { hour12: false })
      .replace(', ', '_')
      .replace(/:/g, '-');

    const gitSha = process.env.GIT_COMMIT_SHA || (process.env.CI && process.env.GITHUB_SHA) || '';
    this.runId = gitSha ? `${this.runTimestamp}_${String(gitSha).substring(0, 8)}` : this.runTimestamp;

    // Artifact folders (created once)
    this.artifactsDir = path.join(this.rootDir, 'artifacts', this.runId);
    this.screenshotsDir = path.join(this.artifactsDir, 'screenshots');
    this.tracesDir = path.join(this.artifactsDir, 'traces');
    this.videosDir = path.join(this.artifactsDir, 'videos');
    this.reportsDir = path.join(this.rootDir, 'reports', this.runId);

    this.ensureBaseFolders();
  }

  /** Ensure base artifact/report folders exist */
  ensureBaseFolders() {
    [this.artifactsDir, this.screenshotsDir, this.tracesDir, this.videosDir, this.reportsDir]
      .forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
  }

  /** Normalize file names (avoid illegal characters) */
  safeName(name) {
    return String(name || '')
      .replace(/[^a-z0-9._-]/gi, '_')
      .substring(0, 200);
  }

  /** Short hash for deterministic, compact IDs */
  shortHash(value) {
    return crypto.createHash('sha1').update(String(value)).digest('hex').substring(0, 8);
  }

  /** Build a unique screenshot path based on scenario + browser + status */
  buildScreenshotPath(scenarioName, browserName, status) {
    const safeScenario = this.safeName(scenarioName);
    const unique = this.shortHash(Date.now());
    const fileName = `${safeScenario}_${browserName}_${unique}.png`;
    const folder = path.join(this.screenshotsDir, status);
    fs.mkdirSync(folder, { recursive: true });
    return path.join(folder, fileName);
  }

  /** Take a screenshot and return path */
  async saveScreenshot(page, scenarioName, browserName, status) {
    const filePath = this.buildScreenshotPath(scenarioName, browserName, status);
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  /** Stop tracing and save trace; optionally delete if not needed */
  async saveTrace(context, scenarioName, browserName, keep) {
    const safeScenario = this.safeName(scenarioName);
    const unique = this.shortHash(Date.now());
    const traceFile = path.join(this.tracesDir, `${safeScenario}_${browserName}_${unique}.zip`);
    await context.tracing.stop({ path: traceFile });

    if (!keep) {
      try { fs.unlinkSync(traceFile); } catch (_) {}
      return null;
    }
    return traceFile;
  }

  /** Delete video file in case you want to save disk space on passes */
  async cleanVideo(page, keepOnPass) {
    if (!page?.video || typeof page.video !== 'function') return;
    const video = await page.video();
    if (!video) return;
    const videoPath = await video.path();
    if (videoPath && !keepOnPass) {
      try { fs.unlinkSync(videoPath); } catch (_) {}
    }
  }
}

module.exports = new TestUtils();