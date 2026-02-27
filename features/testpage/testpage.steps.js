const { Given, When, Then } = require('@cucumber/cucumber');

Given('the user is on the test page', async function () {
  await this.po.testPage.navigateTestPage();
  await this.po.testPage.assertLoginPage();
});

When('the user fills test page username {string} and test page password {string}', async function (username, password) {
  await this.po.testPage.loginEnterCredentials(username, password);
});

Then('the test page main view is visible', async function () {
  await this.po.testPage.assertLoginSuccess();
});

Then('the test page should show an error {string}', async function (expectedMessage) {
  await this.po.testPage.assertLoginError(expectedMessage);
});