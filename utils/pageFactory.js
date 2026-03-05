// Extend this factory as you add more Page Objects in /pages.
const TestPage = require('../pages/testpage.page');
const LoginPage = require('../pages/login.page');
const AddToCartPage = require('../pages/add-to-cart.page');
const MenuNavigationPage = require('../pages/menu-navigation.page');



class PageFactory {
  /** Create all page objects and return them in a single object */
  static create(page) {
    return {
      testPage: new TestPage(page),
      loginPage: new LoginPage(page),
      addPage: new AddToCartPage(page),
      menuPage: new MenuNavigationPage(page),
      
      // add more POs here, e.g. loginPage: new LoginPage(page), dashboardPage: new DashboardPage(page)
    };
  }
}

module.exports = PageFactory;