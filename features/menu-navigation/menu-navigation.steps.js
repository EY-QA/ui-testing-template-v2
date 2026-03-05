const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const MenuNavigationPage = require('../../pages/menu-navigation.page');

let menuPage;

Before(async function () {
  menuPage = new MenuNavigationPage(this.page);
});

Given('the menu is open', async function () {
  await menuPage.clickMenuButton();
});

When('I click on the menu button', async function () {
  await menuPage.clickMenuButton();
});

When('I click on the close menu button', async function () {
  await menuPage.clickCloseMenuButton();
});

When('I click on the {string} link', async function (link) {
  switch (link) {
    case 'All Items':
      await menuPage.clickAllItemsLink();
      break;
    case 'About':
      await menuPage.clickAboutLink();
      break;
    case 'Logout':
      await menuPage.clickLogoutLink();
      break;
    case 'Reset App State':
      await menuPage.clickResetAppStateLink();
      break;
  }
});

Then('the menu sidebar should be visible', async function () {
  const isVisible = await menuPage.isMenuVisible();
  expect(isVisible).toBe(true);
});

Then('the menu should display navigation options', async function () {
  await menuPage.verifyMenuContent();
});

Then('the menu sidebar should be hidden', async function () {
  const isHidden = await menuPage.isMenuHidden();
  expect(isHidden).toBe(true);
});

Then('I should be on the inventory page', async function () {
  await menuPage.verifyOnInventoryPage();
});

Then('a new tab should open to Sauce Labs website', async function () {
  await menuPage.verifyAboutPageOpened();
});

Then('I should be redirected to the login page', async function () {
  await menuPage.verifyOnLoginPage();
});

Then('the app state should be reset', async function () {
  await menuPage.verifyAppStateReset();
});

Then('the menu should remain visible', async function () {
  const isVisible = await menuPage.isMenuVisible();
  expect(isVisible).toBe(true);
});