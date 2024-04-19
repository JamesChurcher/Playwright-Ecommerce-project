//James Churcher
//17/04/24

// const base = require("@playwright/test");
// const { LoginPagePOM } = require("../POMClasses/LoginPage");

import { test as base } from '@playwright/test';
import LoginPagePOM from "../POMClasses/LoginPage";
import NavBarPOM from '../POMClasses/NavBar';
import CartPagePOM from '../POMClasses/CartPage';
import AccountPagePOM from '../POMClasses/AccountPage';

import data from '../testData/testData.json';
import NavBar from '../POMClasses/NavBar';

export const test = base.extend({
    navigateAndLogin: async ({ page }, use) => {
        //---Setup---
        // Get url
		const webURL = process.env.URL

		// Check if environment has set website url
		if (!webURL) {
			throw new Error("URL is undefined");
		}
		console.log("URL " + webURL);

		// Go to website url
		await page.goto(webURL);		//Navigate

		const navbar = new NavBar(page);
		await navbar.DismissPopup();		//Dismiss popup

		// Get username and password
		const username = process.env.USER_NAME;
		const password = process.env.PASSWORD;

		// Check if environment has set username and password
		if (!username || !password) {
			throw new Error("USER_NAME or PASSWORD are undefined");
		}
		console.log("USER_NAME and PASSWORD have been set");

		// Login
		const loginPage = await navbar.GoLogin();		//Go to login page
		await loginPage.LoginExpectSuccess(username, password);
		console.log("Login successful");

        //---Test---
        await use(navbar);

        //---Teardown---
		//Empty cart
		const cartPage = await navbar.GoCart();		//Go to cart page
		await cartPage.MakeCartEmpty();
		console.log("Emptied cart successfully")

		//Logout
		const accountPage = await navbar.GoAccount();		//Go to account page
		await accountPage.LogoutExpectSuccess();
		console.log("Logout successful")
    },

    testProducts: async ({}, use) => {
        process.env.DATAINDEX ??= '0';
        let testData = data[process.env.DATAINDEX].products;
        use(testData);
    },

    testDiscount: async ({}, use) => {
        process.env.DATAINDEX ??= '0';
        let testData = data[process.env.DATAINDEX].discount;
        use(testData);
    },

    testBillingDetails: async ({}, use) => {
        process.env.DATAINDEX ??= '0';
        let testData = data[process.env.DATAINDEX].billingDetails;
        use(testData);
    },
});

export { expect } from '@playwright/test';
