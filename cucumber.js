module.exports = {
  default: {
    require: [
      'features/support/*.js',
      'features/**/*.js',
    ],
    publishQuiet: true,


    format: [
      'summary',                     // ⬅️ replace "progress"
      'json:reports/cucumber.json'   // ✔ JSON write now works
    ],

    paths: ['features/**/*.feature'],
  },
};
