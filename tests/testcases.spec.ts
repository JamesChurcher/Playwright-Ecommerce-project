import { test, expect } from '../fixtures/fixtures';
import { TakeAndAttachScreenshot } from '../utils/HelperMethods';
import { NavBar } from '../POMClasses/POMClasses'

import { discountsData } from '../models/Discount';
import { productsData } from '../models/Product';
import { billingDetailsData as bdData } from '../models/BillingDetails';
const billingDetailsData = bdData[0];

test.describe("my testcases", () => {

	for (const testDiscount of discountsData) {
		test(`Login and apply discount ${testDiscount.code}`, async ({ page, navigateAndLogin }, testInfo) => {
			//Shop
			const navbar: NavBar = navigateAndLogin;
			const shopPage = await navbar.GoShop();		//Go to shop page

			console.log("Add items to cart")
			for (let i = 0; i < productsData.length; i++) {
				let item = productsData[i].product;
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
	}

	test("Login and checkout with a cheque", async ({ page, navigateAndLogin }, testInfo) => {
		//Shop
		const navbar: NavBar = navigateAndLogin;
		const shopPage = await navbar.GoShop();		//Go to shop page

		console.log("Add items to cart")
		for (let i = 0; i < productsData.length; i++) {
			let item = productsData[i].product;
			await shopPage.AddToCart(item);
			console.log(`Added \"${item}\" to the cart`)
		}

		//Checkout
		const checkoutPage = await navbar.GoCheckout();
		const orderSummaryPage = await checkoutPage.CheckoutExpectSuccess(billingDetailsData);

		console.table(billingDetailsData);
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