Feature: Menu Navigation

  Background:
    Given I am logged in

  @smoke
  Scenario: Open menu
    When I click on the menu button
    Then the menu sidebar should be visible
    And the menu should display navigation options

  @smoke
  Scenario: Close menu
    Given the menu is open
    When I click on the close menu button
    Then the menu sidebar should be hidden

  @regression
  Scenario Outline: Navigate via menu
    Given the menu is open
    When I click on the "<link>" link
    Then <outcome>

    Examples:
      | link            | outcome                                      |
      | All Items       | I should be on the inventory page            |
      | About           | a new tab should open to Sauce Labs website  |
      | Logout          | I should be redirected to the login page     |
      | Reset App State | the app state should be reset                |

  @regression
  Scenario: Click menu when open toggles it closed
    Given the menu is open
    When I click on the menu button
    Then the menu sidebar should be hidden