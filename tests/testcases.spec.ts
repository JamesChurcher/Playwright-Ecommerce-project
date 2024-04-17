import { test, expect, Locator } from '@playwright/test';
import { TakeAndAttachScreenshot } from '../utils/HelperMethods';

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
		console.log("URL " + process.env.URL);

		await page.goto(process.env.URL);

		await page.getByRole('link', { name: 'Dismiss' }).click();		//Dismiss popup

		//Login
		const navbar = new NavBarPOM(page);
		await navbar.GoAccount();		//Go to account page

		if (!process.env.USER_NAME || !process.env.PASSWORD){
			throw new Error("USER_NAME or PASSWORD are undefined");
		}
		console.log("USER_NAME and PASSWORD have been set");

		const loginPage = new LoginPagePOM(page);
		await loginPage.Login(process.env.USER_NAME, process.env.PASSWORD);
		console.log("Login successful");

		console.log("-----Setup Complete-----\n");
	})

	test.afterEach("Teardown => Logout", async ({page}) => {
		console.log("\n-----Teardown-----");

		const navbar = new NavBarPOM(page);

		//Empty cart
		await navbar.GoCart();		//Go to cart page
		
		const cartPage = new CartPagePOM(page);
		await cartPage.MakeCartEmpty();
		console.log("Emptied cart successfully")

		//Logout
		await navbar.GoAccount();		//Go to account page
		
		const accountPage = new AccountPagePOM(page);
		await accountPage.Logout();
		console.log("Logout successful")
		
		console.log("-----Teardown Complete-----");
	})

	test("Login and apply discount", async ({page}, testInfo) => {
		//Shop
		const navbar = new NavBarPOM(page);
		await navbar.GoShop();		//Go to shop page

		console.log("Add items to cart")
		const shopPage = new ShopPagePOM(page);
		for(let i=0; i<data.length; i++){
			let item = data[i].product;
			await shopPage.AddToCart(item);
			console.log(`Added \"${item}\" to the cart`)
		}

		//Cart
		await navbar.GoCart();
		const cartPage = new CartPagePOM(page);

		await cartPage.ApplyDiscount("nfocus");		//Apply discount code
		console.log(`Applied discount code \"${"nfocus"}\" successfully`);

		let total = await cartPage.GetTotal();
		let subtotal = await cartPage.GetSubtotal();
		let shipping = await cartPage.GetShipping();
		let discount = await cartPage.GetCoupon();

		console.log(`Total: £${total}\nSubTotal: £${subtotal}\nShipping: £${shipping}\nDiscount: £${discount}`)

		let actualDiscount = (discount/subtotal * 100).toFixed(2)
		let expectedTotal = (subtotal + shipping - discount).toFixed(2)

		expect(actualDiscount).toEqual((25).toFixed(2))				//Assert the amount deducted from discount
		expect(total.toFixed(2)).toEqual(expectedTotal);			//Assert the price is correct

		await TakeAndAttachScreenshot(page, testInfo, "Test1_1", "Cart with discount page");		//Take Screenshot
	})

	test("Login and checkout with a cheque", async ({page}, testInfo) => {
		//Shop
		const navbar = new NavBarPOM(page);
		await navbar.GoShop();		//Go to shop page

		console.log("Add items to cart")
		const shopPage = new ShopPagePOM(page);
		for(let i=0; i<data.length; i++){
			let item = data[i].product;
			await shopPage.AddToCart(item);
			console.log(`Added \"${item}\" to the cart`)
		}

		//Checkout
		await navbar.GoCheckout();
		const checkoutPage = new CheckoutPagePOM(page);
		await checkoutPage.CheckoutExpectSuccess(billingDetailsData[0]);
		console.log("Checkout successful")

		await TakeAndAttachScreenshot(page, testInfo, "Test2_1", "Order summary after checkout");		//Take Screenshot

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

		await TakeAndAttachScreenshot(page, testInfo, "Test2_2", "All orders listed under this account");		//Take Screenshot
	})
})