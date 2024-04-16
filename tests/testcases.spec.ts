import { test, expect, Locator } from '@playwright/test';
import LoginPagePOM from "../POMClasses/LoginPage";
import ShopPagePOM from '../POMClasses/ShopPage';
import NavBarPOM from '../POMClasses/NavBar';
import CartPagePOM from '../POMClasses/CartPage';
import CheckoutPagePOM from '../POMClasses/CheckoutPage';
import OrderSummaryPagePOM from '../POMClasses/OrderSummaryPage';
import AccountPagePOM from '../POMClasses/AccountPage';
import AccountOrdersPagePOM from '../POMClasses/AccountOrdersPage';

import data from '../testData/testProducts.json';
import billingDetailsData from '../testData/testBillingInfo.json'

const discountCode = {code: "nfocus", discount: 25};

test.describe("my testcases", () => {
	test.beforeEach("Setup => Login", async ({page}) => {
		console.log("-----Setup-----");

		//Navigate to site
		if (!process.env.URL){
			throw new Error("URL is undefined");
		}
		await page.goto(process.env.URL);

		console.log("URL " + process.env.URL)

		await page.getByRole('link', { name: 'Dismiss' }).click();		//Dismiss popup

		//Login
		const navbar = new NavBarPOM(page);
		await navbar.GoAccount();		//Go to account page

		if (!process.env.USER_NAME || !process.env.PASSWORD){
			throw new Error("USER_NAME or PASSWORD are undefined");
		}
		console.log(`username ${process.env.USER_NAME} password ${process.env.PASSWORD}`);

		const loginPage = new LoginPagePOM(page);
		await loginPage.Login(process.env.USER_NAME, process.env.PASSWORD);

		console.log("-----Setup Complete-----\n");
	})

	test.afterEach("Teardown => Logout", async ({page}) => {
		console.log("\n-----Teardown-----");

		const navbar = new NavBarPOM(page);

		//Empty cart
		await navbar.GoCart();
		
		const cartPage = new CartPagePOM(page);
		await cartPage.MakeCartEmpty();

		//Logout
		await navbar.GoAccount();		//Go to account page
		
		const accountPage = new AccountPagePOM(page);
		await accountPage.Logout();
		
		console.log("-----Teardown Complete-----");
	})

	test("Login and apply discount", async ({page}) => {
		//Shop
		const navbar = new NavBarPOM(page);
		await navbar.GoShop();		//Go to shop page

		const shopPage = new ShopPagePOM(page);
		for(let i=0; i<data.length; i++){
			await shopPage.AddToCart(data[i].product);
		}

		//Cart
		await navbar.GoCart();
		const cartPage = new CartPagePOM(page);

		await cartPage.ApplyDiscount("nfocus");		//Apply discount code

		let total = await cartPage.GetTotal();
		let subtotal = await cartPage.GetSubtotal();
		let shipping = await cartPage.GetShipping();
		let discount = await cartPage.GetCoupon();

		console.log(`Total: £${total}\nSubTotal: £${subtotal}\nShipping: £${shipping}\nDiscount: £${discount}\n`)

		let actualDiscount = (discount/subtotal * 100).toFixed(2)
		let expectedTotal = (subtotal + shipping - discount).toFixed(2)

		expect(actualDiscount).toEqual((25).toFixed(2))				//Assert the amount deducted from discount
		expect(total.toFixed(2)).toEqual(expectedTotal);			//Assert the price is correct

		await page.screenshot({ path: 'screenshots/Test1_1.png', fullPage: true });		//Take Screenshot
	})

	test("Login and checkout with a cheque", async ({page}) => {
		//Shop
		const navbar = new NavBarPOM(page);
		await navbar.GoShop();		//Go to shop page

		const shopPage = new ShopPagePOM(page);
		for(let i=0; i<data.length; i++){
			await shopPage.AddToCart(data[i].product);
		}

		//Checkout
		await navbar.GoCheckout();
		const checkoutPage = new CheckoutPagePOM(page);
		await checkoutPage.CheckoutExpectSuccess(billingDetailsData[0]);

		await page.screenshot({ path: 'screenshots/Test2_1.png', fullPage: true });		//Take Screenshot

		//Get the order number
		const orderSummaryPage = new OrderSummaryPagePOM(page);
		let orderNumber = await orderSummaryPage.GetOrderNumber();
		console.log("Order number is " + orderNumber);

		//Account orders
		await navbar.GoAccount();
		const accountPage = new AccountPagePOM(page);
		await accountPage.GoAccountOrders();

		//Check if the order number is on the page
		const accountOrdersPage = new AccountOrdersPagePOM(page);
		let allOrderNums = await accountOrdersPage.GetAccountOrders();
		console.log("All order numbers listed: " + allOrderNums);
		
		expect(allOrderNums).toContain(orderNumber);		//Assert new order number is listed on the page

		await page.screenshot({ path: 'screenshots/Test2_2.png', fullPage: true });		//Take Screenshot
	})
})