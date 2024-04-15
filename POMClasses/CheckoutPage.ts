// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the checkout page
export default class CheckoutPage
{
    #page :Page;

    //Locator declarations
    #placeOrderButton :Locator;
    #paymentCheck :Locator;
    #paymentCash :Locator;

    constructor(page :Page) {
        this.#page = page

        //Locators
        this.#placeOrderButton = page.getByRole('button', { name: 'Place order' });
        this.#paymentCheck = page.getByText("Check payments");
        this.#paymentCash = page.getByText("Cash on delivery");
    }

    //Service methods
    public async PlaceOrder(){
        await this.#placeOrderButton.click();
    }

    public async ClickCheck(){
        await this.#paymentCheck.click();
    }

    public async ClickCash(){
        await this.#paymentCash.click();
    }
}