//James Churcher
//17/04/24

import { test as base } from '@playwright/test';
import NavBar from '../POMClasses/NavBar';
import { productsData } from '../models/Product';

type TestFixtures = {
	loginAndNavigate: NavBar,
	loginAndFillCart: NavBar,
};

export const test = base.extend<TestFixtures>({
	//Navigates and logs into an account, returns a navbar POM instance
    loginAndNavigate: async ({ page }, use) => {
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
		//Logout
		const accountPage = await navbar.GoAccount();		//Go to account page
		await accountPage.LogoutExpectSuccess();
		console.log("Logout successful")
    },

	loginAndFillCart: async ({ loginAndNavigate }, use) => {
        //---Setup---
		// Go to shop page
		const navbar: NavBar = loginAndNavigate;
		const shopPage = await navbar.GoShop();

		// Add products to cart
		console.log("Add items to cart")
		for (let i = 0; i < productsData.length; i++) {
			let item = productsData[i].product;
			await shopPage.AddToCart(item);
			console.log(`Added \"${item}\" to the cart`)
		}

        //---Test---
        await use(navbar);
		
		//---Teardown---
		//Empty cart
		const cartPage = await navbar.GoCart();		//Go to cart page
		await cartPage.MakeCartEmpty();
		console.log("Emptied cart successfully")
	}
});

export { expect } from '@playwright/test';
