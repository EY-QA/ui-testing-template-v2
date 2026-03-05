// common-auth.steps.js
const { Given } = require('@cucumber/cucumber');
//const LoginPage = require('../../pages/login.page');

Given('I am logged in', async function () {
 // const loginPage = new LoginPage(this.page);
  await this.po.loginPage.goto();
  await this.po.loginPage.login('standard_user', 'secret_sauce');
  await this.page.waitForURL('**/inventory.html');
});