const { setDefaultTimeout } = require('@cucumber/cucumber');

// Global step timeout (ms) – override with CUCUMBER_STEP_TIMEOUT_MS
setDefaultTimeout(Number(process.env.CUCUMBER_STEP_TIMEOUT_MS || 15000));