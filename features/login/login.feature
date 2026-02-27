Feature: User login
  In order to access protected areas of the application
  As a registered user
  I want to authenticate using my credentials

  Background:
    Given the user is on the login page

  @positive @smoke
  Scenario Outline: Successful login using valid credentials
    When the user enters username "<username>" and password "<password>"
    Then the user should be redirected to the main page

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | performance_glitch_user | secret_sauce |

  @negative @smoke
  Scenario Outline: Unsuccessful login with invalid credentials
    When the user enters username "<username>" and password "<password>"
    Then the user should see an error message "<errorMessage>"

    Examples:
      | username      | password     | errorMessage                                                           |
      | wrong_user    | secret_sauce | Epic sadface: Username and password do not match any user in this service |
      | standard_user | wrong_pass   | Epic sadface: Username and password do not match any user in this service |