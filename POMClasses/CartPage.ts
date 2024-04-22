// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";
import { ToFloat } from "../utils/HelperMethods";

//A POM class for the shop page
export default class CartPage extends BasePOM
{
    //Locator declaratons
    #total: Locator = this.page.locator(".order-total");
    #shipping: Locator = this.page.locator("#shipping_method");
    #coupon: Locator = this.page.locator(".cart-discount");
    #subtotal: Locator = this.page.locator(".cart-subtotal")

    #cartEmpty: Locator = this.page.locator(".cart-empty");
    #removeFromCart: Locator = this.page.getByLabel('Remove this item');

    #discountField: Locator = this.page.getByPlaceholder('Coupon code');
    #discountSubmit: Locator = this.page.getByRole('button', { name: 'Apply coupon' });
    #discountRemove: Locator = this.page.getByRole('link', { name: '[Remove]' });

    constructor(page: Page) {
        super(page);
    }

    //---Service methods---
    public async GetTotal(){
        let text = await this.#total.innerText();
        return ToFloat(text);
    }

    public async GetShipping(){
        let text = await this.#shipping.innerText();
        return ToFloat(text);
    }

    public async GetCoupon(){
        let text = await this.#coupon.innerText();
        return ToFloat(text);
    }

    public async GetSubtotal(){
        let text = await this.#subtotal.innerText();
        return ToFloat(text);
    }

    //Check if the cart is empty
    public async IsEmpty(){
        return await this.#cartEmpty.isVisible();
    }

    //---High-level service methods---

    //Fill in and submit the given coupon
    public async ApplyDiscount(coupon: string){
        await this.#discountField.fill(coupon);
        await this.#discountSubmit.click();
        
        try {
            await this.#coupon.waitFor({ state: "visible", timeout: 4000 });    //Wait for coupon to be applied
        }
        catch (error){
            error.message = "Could not apply coupon code / coupon code not accepted\n" + error.message;     //Throw error if we could not apply coupon
            throw error;
        }
    }

    //Remove any applied coupon
    public async RemoveDiscount(){
        if(await this.#discountRemove.isVisible()){
            await this.#discountRemove.click();
        }

        try {
            await this.#coupon.waitFor({ state: "hidden", timeout: 4000 });    //Wait for coupon to be removed
        }
        catch (error){
            error.message = "Could not remove coupon code\n" + error.message;       //Throw error if we could not remove coupon
            throw error;
        }
    }

    //Method empties cart by removing discount and all items
    public async MakeCartEmpty(){
        //Remove discount
        await this.RemoveDiscount();

        //Remove items
		while (!await this.IsEmpty()){
            //First item in cart
			let element = this.#removeFromCart.first();

            //Click to remove first item from the cart
            try {
                await element.click({timeout: 1000});
            }
            catch {
                //Do nothing
            }
        }
    }
}