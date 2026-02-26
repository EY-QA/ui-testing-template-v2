Feature: User login
  In order to access protected areas
  As a registered user
  I want to log in using valid credentials

  @positive @smoke
  Scenario Outline: Successful login with valid credentials
    Given the user is on the login page
    When the user enters username "<username>" and password "<password>"
    Then the user should be redirected to the main page

    Examples:
      | username                | password     |
      | wrong_user              | secret_sauce |
      | performance_glitch_user | secret_sauce |

  @negative @smoke
  Scenario Outline: Unsuccessful login with invalid credentials
    Given the user is on the login page
    When the user enters username "<username>" and password "<password>"
    Then the user should see an error message "Epic sadface: Username and password do not match any user in this service"

    Examples:
      | username      | password     |
      | wrong_user    | secret_sauce |
      | standard_user | wrong_pass   |

