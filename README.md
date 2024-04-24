# PlayWright Testing Project
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment variables](#environment-variables)
* [Running tests](#running-tests)
  * [Running from Visual Studio Code](#running-from-visual-studio-code)
  * [Running from terminal](#running-from-the-terminal)
* [Troubleshooting](#troubleshooting)

## General Info
The aim of this project is to demonstrate the testing of an e-commerce web application using Playwright test. I created this project as part of a larger training course to demonstrate my knowledge of Playwright and Typescript.

In this project I was tasked with writing two testcases. Testcase one is to apply a discount code to a cart and verify if the correct amount was deducted, testcase two is to checkout a cart and verify if the new order created is listed under the account that it was purchased with.

## Technologies
* JavaScript
* TypeScript
* Node.js
* Playwright test

## Setup

### Prerequisites

* Playwright test for VSCode

In order to run this project from VSCode, you should install the Playwright test extension which can be found [here](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

### Installation

1. Clone this repository
   ```powershell
   git clone "https://github.com/JamesChurcher/Playwright-Ecommerce-project.git"
   ```

2. Create an account on the edgewords shop website https://www.edgewordstraining.co.uk/demo-site/ and record the username and password used

    ![Screenshot of login and register page][AccountPage]

### Environment variables

Create a file called `.env.local` inside the folder `.\Ecommerce mini project\env` with the text below. Update the environment variables, particularly the username and password of the account previously created that the tests will login to.

```env
USER_NAME = 'username'
PASSWORD = 'password'
```

## Running tests

These tests can be run from both the terminal and Visual Studio Code and the following instructions lay out both methods

### Running from Visual Studio Code

1. First open the project folder `Ecommerce mini project` in VSCode
2. Open the Playwright test extension tab
3. Run the tests by clicking the play button

### Running from the terminal

Using the terminal is a lightweight method to run these tests and the following steps will demonstrate this

1. Open a new terminal and navigate to the project folder `.\Ecommerce mini project`.

2. Run the command
   ```powershell
   npx playwright test --workers=1
   ```
   Workers is set to 1 because there is only one account being used so the tests will fail each other since they are not being run in isolation.

This will run the tests and the terminal will display the output and results which should look something like the following:
```powershell
PS \> npx playwright test --workers=1
Running 9 tests using 1 worker
[chromium] › testcases.spec.ts:14:7 › my testcases › Login and apply discount nfocus
USER_NAME and PASSWORD have been set
Login successful
Add items to cart
Added "Cap" to the cart
Added "Belt" to the cart
Added "Hoodie" to the cart
Added "Polo" to the cart
Applied discount code "nfocus" successfully
Total: £103.7
SubTotal: £133
Shipping: £3.95
Discount: £33.25
 Test Pass
┌──────────┬───────────┬───────────┐
│ (index)  │ Expected  │ Actual    │
├──────────┼───────────┼───────────┤
│ Discount │ '25.00%'  │ '25.00%'  │
│ Total    │ '£103.70' │ '£103.70' │
└──────────┴───────────┴───────────┘
Emptied cart successfully
Logout successful
[chromium] › testcases.spec.ts:14:7 › my testcases › Login and apply discount edgewords
#... Test output ...

#Results
  9 passed (3.0m)

To open last HTML report run:

  npx playwright show-report

PS \>
```

# Troubleshooting


[AccountPage]: ./README-Assets/AccountPage.png
