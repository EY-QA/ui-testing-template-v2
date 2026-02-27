const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

//
// BACKGROUND
//
Given("the user is on the login page", async function () {
  await this.po.loginPage.goto();
});

//
// SUCCESSFUL LOGIN
//
When(
  "the user enters username {string} and password {string}",
  async function (username, password) {
    await this.po.loginPage.login(username, password);
  }
);

Then("the user should be redirected to the main page", async function () {
  // Validate redirect
  await expect(this.page).toHaveURL(/inventory\.html/);

  // Optional stronger assertion:
  // await expect(this.page.locator('[data-test="inventory-list"]')).toBeVisible();
});

//
// UNSUCCESSFUL LOGIN
//
Then(
  "the user should see an error message {string}",
  async function (expectedMessage) {
    const message = await this.po.loginPage.getErrorMessage();
    expect(message).toContain(expectedMessage);
  }
);