import { test, expect } from '@playwright/test';
import { TakeAndAttachScreenshot } from '../utils/HelperMethods';

import {
	LoginPage,
	ShopPage,
	NavBar,
	CartPage,
	CheckoutPage,
	OrderSummaryPage,
	AccountPage,
	AccountOrdersPage,
} from '../POMClasses/POMClasses'

import data from '../testData/testData.json';

test.describe("my testcases", () => {
	let testProducts :Array<any>;
	let testDiscount :any;
	let testBillingDetails :any;

	test.beforeEach("Setup => Login", async ({ page }) => {
		console.log("-----Setup-----");
		
		// Check if data index has been set -> Defines what data set to use from the test data
		if (!process.env.DATAINDEX) {
			process.env.DATAINDEX = '0';
			console.log("No test data index set, using default 0");
		}
		else{
			console.log("Test data index is " + process.env.DATAINDEX);
		}

		let testData = data[process.env.DATAINDEX]

		// Pass through to variables used during the tests
		testProducts = testData.products;
		testDiscount = testData.discount;
		testBillingDetails = testData.billingDetails;
		console.log("Test data set up successfully")

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

		console.log("-----Setup Complete-----\n");
	})

	test.afterEach("Teardown => Empty cart and Logout", async ({ page }) => {
		console.log("\n-----Teardown-----");

		const navbar = new NavBar(page);

		//Empty cart
		const cartPage = await navbar.GoCart();		//Go to cart page
		await cartPage.MakeCartEmpty();
		console.log("Emptied cart successfully")

		//Logout
		const accountPage = await navbar.GoAccount();		//Go to account page
		await accountPage.LogoutExpectSuccess();
		console.log("Logout successful")

		console.log("-----Teardown Complete-----");
	})

	test("Login and apply discount", async ({ page }, testInfo) => {
		//Shop
		const navbar = new NavBar(page);
		const shopPage = await navbar.GoShop();		//Go to shop page

		console.log("Add items to cart")
		for (let i = 0; i < testProducts.length; i++) {
			let item = testProducts[i].product;
			await shopPage.AddToCart(item);
			console.log(`Added \"${item}\" to the cart`)
		}

		//Cart
		const cartPage = await navbar.GoCart();
		await cartPage.ApplyDiscount(testDiscount.code);		//Apply discount code
		console.log(`Applied discount code \"${testDiscount.code}\" successfully`);

		let total = await cartPage.GetTotal();
		let subtotal = await cartPage.GetSubtotal();
		let shipping = await cartPage.GetShipping();
		let discount = await cartPage.GetCoupon();

		console.log(`Total: £${total}\nSubTotal: £${subtotal}\nShipping: £${shipping}\nDiscount: £${discount}`)

		let actualDiscount = (discount / subtotal * 100).toFixed(2)
		let expectedTotal = (subtotal + shipping - discount).toFixed(2)

		expect(actualDiscount, "Incorrect discount applied").toEqual((testDiscount.value).toFixed(2))	//Assert the amount deducted from discount
		expect(total.toFixed(2), "Incorrect final total").toEqual(expectedTotal);						//Assert the price is correct

		//Reporting
		console.log("\u001b[1;32m Test Pass\x1b[0m")
		console.table({
			"Discount":{"Expected": (testDiscount.value).toFixed(2)+"%","Actual": actualDiscount+"%"},
			"Total":{"Expected": "£"+expectedTotal,"Actual": "£"+total.toFixed(2)}
		})

		await TakeAndAttachScreenshot(page, testInfo, "Test1_1", "Cart with discount page");		//Take Screenshot
	})

	test("Login and checkout with a cheque", async ({ page }, testInfo) => {
		//Shop
		const navbar = new NavBar(page);
		const shopPage = await navbar.GoShop();		//Go to shop page

		console.log("Add items to cart")
		for (let i = 0; i < testProducts.length; i++) {
			let item = testProducts[i].product;
			await shopPage.AddToCart(item);
			console.log(`Added \"${item}\" to the cart`)
		}

		//Checkout
		const checkoutPage = await navbar.GoCheckout();
		const orderSummaryPage = await checkoutPage.CheckoutExpectSuccess(testBillingDetails);

		console.table(testBillingDetails);
		console.log("Checkout successful")

		await TakeAndAttachScreenshot(page, testInfo, "Test2_1", "Order summary after checkout");		//Take Screenshot

		//Get the order number
		let orderNumber = await orderSummaryPage.GetOrderNumber();
		console.log("Order number is " + orderNumber);

		//Account orders
		const accountPage = await navbar.GoAccount();
		const accountOrdersPage = await accountPage.GoAccountOrders();

		//Check if the order number is on the page
		let allOrderNums = await accountOrdersPage.GetAccountOrders();
		console.log("All order numbers listed: " + allOrderNums);

		expect(allOrderNums, "Order not listed under this account").toContain(orderNumber);		//Assert new order number is listed on the page

		console.log("\u001b[1;32m Test Pass\x1b[0m")

		await TakeAndAttachScreenshot(page, testInfo, "Test2_2", "All orders listed under this account");		//Take Screenshot
	})
})