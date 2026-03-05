Feature: Add to Cart

  Background:
    Given the user is on the inventory page

  Scenario: Add a product to cart from inventory
    When the user adds "Sauce Labs Backpack" to cart
    Then the cart badge should show "1"
    And the product button for "Sauce Labs Backpack" should show "Remove"
    When the user views the cart
    Then the cart should contain "Sauce Labs Backpack"

  Scenario: Add a product to cart from its detail page
    When the user opens the product detail for "Sauce Labs Backpack"
    And the user adds "Sauce Labs Backpack" to cart
    Then the cart badge should show "1"
    And the product button for "Sauce Labs Backpack" should show "Remove"
    When the user goes back to inventory page
    Then the product button for "Sauce Labs Backpack" should show "Remove"

  Scenario: Add multiple different products to cart
    When the user adds "Sauce Labs Backpack" to cart
    And the user adds "Sauce Labs Bike Light" to cart
    And the user adds "Sauce Labs Bolt T-Shirt" to cart
    Then the cart badge should show "3"
    When the user views the cart
    Then the count of products in cart should be "3"

  Scenario: Remove an item from cart
    Given the user has added "Sauce Labs Backpack" and "Sauce Labs Bike Light" to cart
    When the user views the cart
    And the user removes "Sauce Labs Backpack" from cart
    Then the cart badge should show "1"
    And the cart should not contain "Sauce Labs Backpack"

  Scenario: Continue shopping and add another product
    Given the user has added "Sauce Labs Backpack" to cart
    When the user views the cart
    And the user continues shopping
    And the user adds "Sauce Labs Bike Light" to cart
    Then the cart badge should show "2"

  Scenario: Complete checkout process
    Given the user has added "Sauce Labs Backpack" to cart
    When the user views the cart
    And the user proceeds to checkout
    And the user fills checkout information with "John" "Doe" "12345"
    And the user continues checkout
    And the user finishes checkout
    Then the checkout confirmation should be visible

  Scenario: Cancel checkout returns to cart
    Given the user has added "Sauce Labs Backpack" to cart
    When the user views the cart
    And the user proceeds to checkout
    And the user cancels checkout
    Then the cart badge should show "1"
    When the user proceeds to checkout
    And the user fills checkout information with "John" "Doe" "12345"
    And the user continues checkout
    And the user cancels overview
    Then the cart badge should show "1"

  Scenario Outline: Checkout validation prevents incomplete info
    Given the user has added "Sauce Labs Backpack" to cart
    When the user views the cart
    And the user proceeds to checkout
    When the user fills checkout information with "<first>" "<last>" "<zip>"
    And the user continues checkout
    Then the checkout form should show validation errors

    Examples:
      | first | last | zip   |
      |       |      |       |
      | John  |      |       |
      | John  | Doe  |       |

  Scenario: Checkout with empty cart
    When the user views the cart
    Then the count of products in cart should be "0"
    When the user proceeds to checkout
    Then the checkout overview should show no items

  Scenario: All products can be added to cart
    When the user adds all available products to cart
    Then all products should be added to cart
    And the cart badge should show a number greater than "0"

  Scenario: Cart persists across navigation
    When the user adds "Sauce Labs Backpack" to cart
    And the user opens the product detail for "Sauce Labs Bike Light"
    Then the cart badge should show "1"
    When the user goes back to inventory page
    Then the cart badge should show "1"