// pages/add-to-cart.page.js
class AddToCartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // header
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    // checkout
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  _id(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  async addItemToCart(name) {
    const id = this._id(name);
    const specific = this.page.getByTestId(`add-to-cart-${id}`);
    if (await specific.count()) {
      await specific.click();
      return;
    }
    // fallback for product detail page where button uses generic test id
    const generic = this.page.getByTestId('add-to-cart');
    if (await generic.count()) {
      await generic.click();
      return;
    }
    throw new Error(`Add to cart button not found for product: ${name}`);
  }

  async openProductDetail(name) {
    console.log(`Finding product link for: ${name}`);
    await this.page.getByText(name).click();
  }

  async getCartBadgeCount() {
    if ((await this.cartBadge.count()) === 0) return '0';
    return (await this.cartBadge.textContent()).trim();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async removeItemFromCart(name) {
    const id = this._id(name);
    await this.page.getByTestId(`remove-${id}`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async fillCheckoutInformation(first, last, zip) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async cancelOverview() {
    await this.cancelButton.click();
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: /Continue Shopping/i }).click();
  }

  async getCartItemNames() {
    return this.page.locator('.cart_item .inventory_item_name').allTextContents();
  }

  async getProductButtonText(name) {
    const id = this._id(name);
    const add = this.page.getByTestId(`add-to-cart-${id}`);
    if ((await add.count()) && (await add.isVisible())) return await add.textContent();
    const rem = this.page.getByTestId(`remove-${id}`);
    if ((await rem.count()) && (await rem.isVisible())) return await rem.textContent();
    // fallback to generic add/remove button used on product detail page
    const genericAdd = this.page.getByTestId('add-to-cart');
    if ((await genericAdd.count()) && (await genericAdd.isVisible())) return await genericAdd.textContent();
    const genericRem = this.page.getByTestId('remove');
    if ((await genericRem.count()) && (await genericRem.isVisible())) return await genericRem.textContent();
    return '';
  }

  async addAllProducts() {
    while (true) {
      const btn = this.page.locator('button[data-test^="add-to-cart-"]').first();
      if (!(await btn.count())) break;
      await btn.click();
    }
  }

  async getCartCount() {
    return this.getCartBadgeCount();
  }

  async getNumberOfCartItems() {
    const names = await this.getCartItemNames();
    return names.length;
  }

  async showCheckoutValidationErrors() {
    return this.errorMessage.isVisible();
  }
}

module.exports = AddToCartPage;