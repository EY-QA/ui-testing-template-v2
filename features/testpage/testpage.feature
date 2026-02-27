@testpage
Feature: Test page flows
  In order to validate the test page independently
  As a QA
  I want to use distinct steps that do not collide with the login module

  Background:
    Given the user is on the test page

  Scenario Outline: Successful access to the test page
    When the user fills test page username "<username>" and test page password "<password>"
    Then the test page main view is visible

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | performance_glitch_user | secret_sauce |

  Scenario Outline: Unsuccessful access on the test page
    When the user fills test page username "<username>" and test page password "<password>"
    Then the test page should show an error "<errorMessage>"

    Examples:
      | username      | password     | errorMessage                                                           |
      | wrong_user    | secret_sauce | Epic sadface: Username and password do not match any user in this service |
      | standard_user | wrong_pass   | Epic sadface: Username and password do not match any user in this service |