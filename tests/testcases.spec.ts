import { test, expect } from '../fixtures/fixtures';
import { TakeAndAttachScreenshot } from '../utils/HelperMethods';
import { NavBar } from '../POMClasses/POMClasses'

import { discountsData } from '../models/Discount';
import { billingDetailsData as bdData } from '../models/BillingDetails';
const billingDetailsData = bdData[0];

test.use({ randomProducts: 4 })		//Add 4 random products to cart

test.describe("my testcases", () => {

	for (const testDiscount of discountsData) {
		test(`Login and apply discount ${testDiscount.code}`, async ({ page, loginFillCart }, testInfo) => {
			//Shop
			const navbar: NavBar = loginFillCart;

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

			await TakeAndAttachScreenshot(page, testInfo, "Test1_1", "Cart with discount page");		//Take Screenshot

			expect(actualDiscount, "Incorrect discount applied").toEqual((testDiscount.value).toFixed(2))	//Assert the amount deducted from discount
			expect(total.toFixed(2), "Incorrect final total").toEqual(expectedTotal);						//Assert the price is correct

			//Reporting
			console.log("\u001b[1;32m Test Pass\x1b[0m")
			console.table({
				"Discount":{"Expected": (testDiscount.value).toFixed(2)+"%","Actual": actualDiscount+"%"},
				"Total":{"Expected": "£"+expectedTotal,"Actual": "£"+total.toFixed(2)}
			})
		})
	}

	test("Login and checkout with a cheque", async ({ page, loginRandomCart }, testInfo) => {
		//Shop
		const navbar: NavBar = loginRandomCart;

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

		await TakeAndAttachScreenshot(page, testInfo, "Test2_2", "All orders listed under this account");		//Take Screenshot

		expect(allOrderNums, "Order not listed under this account").toContain(orderNumber);		//Assert new order number is listed on the page

		console.log("\u001b[1;32m Test Pass\x1b[0m")
	})
})