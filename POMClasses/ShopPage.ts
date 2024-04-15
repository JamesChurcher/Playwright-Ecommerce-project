// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the shop page
export default class ShopPagePOM
{
    #page :Page;

    //Locator declarations
    #addToCartButtons :Locator;

    constructor(page :Page) {
        this.#page = page

        //Locators
        this.#addToCartButtons = page.getByLabel(/Add “.*” to your cart/);
        page.getByText("Beanie")
    }

    //Service methods
    public async AddToCart(item :string){
        const btn = this.#page.getByLabel("Add “"+ item +"” to your cart");

        if (await btn.isVisible()){
            await btn.click();
            console.log(`Added ${item} to the cart`)
        }
        else {
            throw new Error(`Could not find product ${item} on the store page"`)
        }
    }
}