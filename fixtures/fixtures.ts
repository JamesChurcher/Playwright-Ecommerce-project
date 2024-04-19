//James Churcher
//17/04/24

import { test as base } from '@playwright/test';

import NavBar from '../POMClasses/NavBar';
import {
	ProductData,
	DiscountData,
	BillingDetailsData
} from '../models/ModelClasses'

// import data from '../testData/testData.json';

import productData from '../testData/products.json';
import discountData from '../testData/discounts.json';
import billingDetailsData from '../testData/billingDetails.json';

type TestFixtures = { 
	navigateAndLogin: NavBar, 
	testProducts: ProductData[], 
	testDiscount: DiscountData, 
	testBillingDetails: BillingDetailsData
};

export const test = base.extend<TestFixtures>({
	//Navigates and logs into an account, returns a navbar POM instance
    navigateAndLogin: async ({ page }, use) => {
        //---Setup---
		// Go to website url
		await page.goto('');		//Navigate

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

	//Returns a list of products
    testProducts: async ({}, use) => {
        let testData: ProductData[] = productData;
        use(testData);
    },

	//Returns a discount code
    testDiscount: async ({}, use) => {
        process.env.DATAINDEX ??= '0';
        let testData: DiscountData = discountData[process.env.DATAINDEX];
        use(testData);
    },

	//Returns an object containing billings information
    testBillingDetails: async ({}, use) => {
        process.env.DATAINDEX ??= '0';
        let testData: BillingDetailsData = billingDetailsData[process.env.DATAINDEX];
        use(testData);
    },
});

export { expect } from '@playwright/test';
