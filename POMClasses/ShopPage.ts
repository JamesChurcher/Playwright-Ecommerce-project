// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

//A POM class for the shop page
export default class ShopPage extends BasePOM
{
    //Locator declarations
    #numItemsInCart: Locator = this.page.getByText(/\d+ items?/);
    #productsOnPage: Locator = this.page.locator(".product").locator('h2');

    constructor(page: Page) {
        super(page)
    }

    //---Service methods---
    private async GetCartQuantity(){
        let quantity = (await this.#numItemsInCart.innerText()).replace(/\D/g, "");
        return Number(quantity);
    }

    public async AddToCart(item: string){
        //Get add to cart button
        const btn = this.page.getByLabel("Add “"+ item +"” to your cart");      //TODO move locator to top of page

        //Throw error if item is not on store page
        if (!await btn.isVisible()){
            throw new Error(`Could not find product ${item} on the store page`)
        }

        //Quantity of cart before adding
        let count = await this.GetCartQuantity();
        count++;
        
        //Click add to cart button
        await btn.click();

        //Wait for cart item to increment
        let flag = false;
        let attempts = 15;
        for (let i=0; i<attempts; i++){
            if (await this.GetCartQuantity() >= count){
                flag = true;
                break;
            }
            await this.page.waitForTimeout(150);
        }
        if (!flag){
            throw new Error("Timed out waiting for the cart quantity to increment after adding an item")    //Throw error if cart quantity did not increment
        }
    }

    // public async GetProductNames(){
    //     const pee = (await this.#productsOnPage.all()).map(async locator => await locator.textContent());
    //     return pee;
    // }

    public async GetProductNames(){
        let products: string[] = [];    //List of product names

        for ( const locator of await this.#productsOnPage.all()){
            let name = await locator.textContent();
            if (name){
                products.push(name);
            }
        }

        return products;
    }
}