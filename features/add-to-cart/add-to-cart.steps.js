// features/add-to-cart/add-to-cart.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../../pages/login.page');
const AddToCartPage = require('../../pages/add-to-cart.page');

Given('the user is on the inventory page', async function () {
  //this.loginPage = new LoginPage(this.page);
  await this.po.loginPage.goto();
  await this.po.loginPage.login('standard_user', 'secret_sauce');
  //this.addPage = new AddToCartPage(this.page);
});

Given('the user has added {string} to cart', async function (product) {
  //this.addPage = this.addPage || new AddToCartPage(this.page);
  await this.po.addPage.addItemToCart(product);
});

Given(
  'the user has added {string} and {string} to cart',
  async function (p1, p2) {
    //this.addPage = this.addPage || new AddToCartPage(this.page);
    await this.po.addPage.addItemToCart(p1);
    await this.po.addPage.addItemToCart(p2);
  }
);

When('the user adds {string} to cart', async function (product) {
  await this.po.addPage.addItemToCart(product);
});

When('the user opens the product detail for {string}', async function (product) {
  console.log(`Opening product detail for: ${product}`);
  await this.po.addPage.openProductDetail(product);
});

When('the user views the cart', async function () {
  await this.po.addPage.goToCart();
});

When('the user removes {string} from cart', async function (product) {
  await this.po.addPage.removeItemFromCart(product);
});

When('the user proceeds to checkout', async function () {
  await this.po.addPage.checkout();
});

When(
  'the user fills checkout information with {string} {string} {string}',
  async function (first, last, zip) {
    await this.po.addPage.fillCheckoutInformation(first, last, zip);
  }
);

When('the user continues checkout', async function () {
  await this.po.addPage.continueCheckout();
});

When('the user finishes checkout', async function () {
  await this.po.addPage.finishCheckout();
});

When('the user cancels checkout', async function () {
  await this.po.addPage.cancelCheckout();
});

When('the user cancels overview', async function () {
  await this.po.addPage.cancelOverview();
});

When('the user continues shopping', async function () {
  await this.po.addPage.continueShopping();
});

When('the user goes back to inventory page', async function () {
  await this.page.goBack();
});

When('the user adds all available products to cart', async function () {
  await this.po.addPage.addAllProducts();
});

Then('the cart badge should show {string}', async function (count) {
  const txt = await this.po.addPage.getCartBadgeCount();
  if (txt !== count) throw new Error(`expected badge ${count} but got ${txt}`);
});

Then(
  'the cart badge should show a number greater than {string}',
  async function (threshold) {
    const num = parseInt(await this.po.addPage.getCartBadgeCount(), 10);
    if (num <= parseInt(threshold, 10))
      throw new Error(`badge ${num} is not greater than ${threshold}`);
  }
);

Then('the cart should contain {string}', async function (product) {
  const items = await this.po.addPage.getCartItemNames();
  if (!items.includes(product))
    throw new Error(`product ${product} not in cart`);
});

Then('the cart should not contain {string}', async function (product) {
  const items = await this.po.addPage.getCartItemNames();
  if (items.includes(product))
    throw new Error(`product ${product} still in cart`);
});

Then(
  'the count of products in cart should be {string}',
  async function (count) {
    const items = await this.po.addPage.getCartItemNames();
    if (String(items.length) !== count)
      throw new Error(`expected ${count} items but got ${items.length}`);
  }
);

Then('the checkout confirmation should be visible', async function () {
  const visible = await this.page
    .getByText('Thank you for your order!')
    .isVisible();
  if (!visible) throw new Error('confirmation not visible');
});

Then('the checkout overview should show no items', async function () {
  const names = await this.po.addPage.getCartItemNames();
  if (names.length !== 0) throw new Error('overview has items');
});

Then('the checkout form should show validation errors', async function () {
  if (!(await this.po.addPage.showCheckoutValidationErrors()))
    throw new Error('expected validation errors');
});

Then(
  'the product button for {string} should show {string}',
  async function (product, text) {
    const btn = await this.po.addPage.getProductButtonText(product);
    if (!btn.includes(text))
      throw new Error(`expected button text ${text} got ${btn}`);
  }
);

Then('all products should be added to cart', async function () {
  const count = await this.po.addPage.getCartCount();
  if (Number(count) === 0) throw new Error('no products added');
});
