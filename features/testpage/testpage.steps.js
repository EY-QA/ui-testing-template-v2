const { Given, When, Then } = require('@cucumber/cucumber');

Given('the user is on the login page', async function () {
  await this.testPage.navigateTestPage();
  await this.testPage.assertLoginPage();
});

When(
  'the user enters username {string} and password {string}',
  async function (username, password) {
    await this.testPage.loginEnterCredentials(username, password);
  
});

Then(
  'the user should be redirected to the main page',
  async function () {
    await this.testPage.assertLoginSuccess();
  
});

Then(
  'the user should see an error message {string}',
  async function (expectedMessage) {
    await this.testPage.assertLoginError(expectedMessage);
});


