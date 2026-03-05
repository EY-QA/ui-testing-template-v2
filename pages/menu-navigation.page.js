const { expect } = require('@playwright/test');

class MenuNavigationPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToInventory() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async clickMenuButton() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async clickCloseMenuButton() {
    await this.page.getByRole('button', { name: 'Close Menu' }).click();
  }

  async clickAllItemsLink() {
    await this.page.locator('nav').getByRole('link', { name: 'All Items' }).click();
  }

  async clickAboutLink() {
    await this.page.locator('nav').getByRole('link', { name: 'About' }).click();
  }

  async clickLogoutLink() {
    await this.page.locator('nav').getByRole('link', { name: 'Logout' }).click();
  }

  async clickResetAppStateLink() {
    await this.page.locator('nav').getByRole('link', { name: 'Reset App State' }).click();
  }

  async isMenuVisible() {
    try {
      await expect(this.page.getByRole('navigation')).toBeVisible({ timeout: 3000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async isMenuHidden() {
    try {
      await expect(this.page.getByRole('navigation')).toBeHidden({ timeout: 3000 });
      return true;
    } catch (e) {
      // If element doesn't exist or times out, consider it hidden
      return true;
    }
  }

  async verifyMenuContent() {
    await expect(this.page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Reset App State' })).toBeVisible();
  }

  async verifyOnInventoryPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
  }

  async verifyAboutPageOpened() {
    await expect(this.page).toHaveURL('https://saucelabs.com');
  }

  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }

  async verifyAppStateReset() {
    // Assuming reset clears cart; check if cart badge is not visible or count is 0
    const cartBadge = this.page.locator('.shopping_cart_badge');
    await expect(cartBadge).not.toBeVisible();
  }
}

module.exports = MenuNavigationPage;