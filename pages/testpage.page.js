const { expect } = require('@playwright/test');
class TestPage {

  // actions
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  async navigateTestPage() {
    await this.page.goto('/');
  }

  async loginEnterCredentials(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  // assertations
  async assertLoginPage() {
    await expect(this.page).toHaveURL(/saucedemo\.com/);
  }
  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/inventory/)
  }
  async assertLoginError(expectedText) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }

}
module.exports = TestPage;
