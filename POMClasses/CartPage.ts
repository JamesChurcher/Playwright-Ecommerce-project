// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the shop page
export default class CartPagePOM
{
    #page :Page;

    //Locator declaratons
    #subtotal :Locator;
    #shipping :Locator;
    #coupon :Locator;
    #total :Locator;

    #cartEmpty :Locator;
    #removeFromCart :Locator;

    #discountField :Locator
    #discountSubmit :Locator;
    #discountRemove :Locator;

    constructor(page :Page) {
        this.#page = page;

        //Locators
        this.#total = page.locator(".order-total");
        this.#shipping = page.locator("#shipping_method");
        this.#coupon = page.locator(".cart-discount");
        this.#subtotal = page.locator(".cart-subtotal")

        this.#cartEmpty = page.locator(".cart-empty");
        this.#removeFromCart = page.getByLabel('Remove this item');

        this.#discountField = page.getByPlaceholder('Coupon code');
        this.#discountSubmit = page.getByRole('button', { name: 'Apply coupon' });
        this.#discountRemove = page.getByRole('link', { name: '[Remove]' });
    }

    //Service methods
    private ToFloat(text :string){
        return parseFloat(text.replace(/[^\d\.]/g, ""));
    }

    public async GetTotal(){
        let text = await this.#total.innerText();
        return this.ToFloat(text);
    }

    public async GetShipping(){
        let text = await this.#shipping.innerText();
        return this.ToFloat(text);
    }

    public async GetCoupon(){
        let text = await this.#coupon.innerText();
        return this.ToFloat(text);
    }

    public async GetSubtotal(){
        let text = await this.#subtotal.innerText();
        return this.ToFloat(text);
    }

    public async IsEmpty(){
        return await this.#cartEmpty.isVisible();
    }

    //Fill in and submit the given coupon
    public async ApplyDiscount(coupon :string){
        await this.#discountField.fill(coupon);
        await this.#discountSubmit.click();

        await this.#coupon.waitFor({ state: "visible" });   //Wait for coupon to be applied
    }

    //Remove any applied coupon
    public async RemoveDiscount(){
        if(await this.#discountRemove.isVisible()){
            await this.#discountRemove.click();
        }

        await this.#coupon.waitFor({ state: "hidden" });    //Wait for coupon to be removed
    }

    //Method empties cart by removing discount and all items
    public async MakeCartEmpty(){
        //Remove discount
        await this.RemoveDiscount();

        //Remove items
		while (await this.#removeFromCart.count() > 0){
            //Quantity of cart before decrementing
            let count = await this.#removeFromCart.count();
            count--;

			let element = this.#removeFromCart.first();     //First item in cart

            //Click to remove first item from the cart
            await element.click();

            //Wait for number of items in cart to decrement
            let attempts = 15;
            for (let i=0; i<attempts; i++){
                if (await this.#removeFromCart.count() <= count){
                    break;
                }
                await this.#page.waitForTimeout(100);
            }
        }
    }
}