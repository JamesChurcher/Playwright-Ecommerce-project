// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the shop page
export default class ShopPagePOM
{
    #page :Page;

    //Locator declarations
    #addToCartButtons :Locator;
    #numItemsInCart :Locator;

    constructor(page :Page) {
        this.#page = page

        //Locators
        this.#addToCartButtons = page.getByLabel(/Add “.*” to your cart/);
        this.#numItemsInCart = page.getByText(/\d+ items?/);
    }

    private async GetCartQuantity(){
        let quantity = (await this.#numItemsInCart.innerText()).replace(/\D/g, "");
        return Number(quantity);
    }

    //Service methods
    public async AddToCart(item :string){
        const btn = this.#page.getByLabel("Add “"+ item +"” to your cart");

        //Throw error if item is not on store page
        if (!await btn.isVisible()){
            throw new Error(`Could not find product ${item} on the store page"`)
        }

        //Quantity of cart before adding
        let count = await this.GetCartQuantity();
        count++;
        
        //Click add to cart button
        await btn.click();

        //Wait for cart item to increment
        let attempts = 10;
        for (let i=0; i<attempts; i++){
            if (await this.GetCartQuantity() >= count){
                break;
            }
            await this.#page.waitForTimeout(100);
        }
    }
}