// James Churcher
// 03/04/24

import { Locator, Page, selectors } from "@playwright/test";

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

    #discountField :Locator
    #discountSubmit :Locator;

    constructor(page :Page) {
        this.#page = page;

        //Locators
        this.#total = page.locator(".order-total");
        this.#shipping = page.locator("#shipping_method");
        this.#coupon = page.locator(".cart-discount");
        this.#subtotal = page.locator(".cart-subtotal")

        this.#cartEmpty = page.locator(".cart-empty");

        this.#discountField = page.getByPlaceholder('Coupon code');
        this.#discountSubmit = page.getByRole('button', { name: 'Apply coupon' });
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

    public async ApplyDiscount(coupon :string){
        await this.#discountField.fill(coupon);
        await this.#discountSubmit.click();

        // await this.#page.waitForFunction(() => this.#coupon.isVisible());   //Broken

        // const myWait = this.#page.waitForFunction(() => this.#coupon.isVisible());
        // await myWait;

        // await this.#page.waitForFunction(selector => selector.isVisible(), this.#coupon);

        // const watchDog = this.#page.waitForFunction(() => window.innerWidth < 1000);
        // await this.#page.setViewportSize({ width: 50, height: 50 });
        // await watchDog;

        await this.#coupon.waitFor({ state: "visible" });

        console.log("Is discount field visible " + await this.#discountField.isVisible());
        console.log("Is discount visible " + await this.#coupon.isVisible());

        // console.log("Hello Waited");
    }
}