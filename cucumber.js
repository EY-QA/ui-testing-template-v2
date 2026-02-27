module.exports = {
  default: {
    requireModule: ['dotenv/config'],
    require: [
      'features/support/00_setup.js',
      'features/support/01_world.js',
      'features/support/02_hooks.js',
      'features/**/*.steps.js'

    ],
    publishQuiet: true,
    tags: process.env.TAGS || 'not @wip',
  // parallel: Number(process.env.CUCUMBER_PARALLEL || 1),

    format: [
      'progress',                     // ⬅️ replace "progress"
      'json:reports/cucumber.json'   // ✔ JSON write now works
    ],

    paths: ['features/**/*.feature'],
  },
};