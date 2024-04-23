// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

//A POM class for the shop page
export default class ShopPage extends BasePOM
{
    //Locator declarations
    private readonly numItemsInCart: Locator = this.page.getByText(/\d+ items?/);
    private readonly productsInShop: Locator = this.page.locator('.product');
    private readonly productNames: Locator = this.page.locator('h2');
    private readonly productAddBtn: Locator = this.page.getByText("Add to cart");

    private productToBtnDict: { [key: string]: Locator } = {};

    constructor(page: Page) {
        super(page)
    }

    //---Service methods---
    //Returns the number of items in the cart
    private async GetCartQuantity(){
        let quantity = (await this.numItemsInCart.innerText()).replace(/\D/g, "");
        return Number(quantity);
    }

    private async PopulateDict(){
        for (const product of await this.productsInShop.all()) {
            let name = await product.locator(this.productNames).textContent();
            let btn = product.locator(this.productAddBtn);
            
            if (name) {
                this.productToBtnDict[name] = btn;
            }
        }
    }

    //Adds the given product to the cart if it exists in the shop
    public async AddToCart(item: string){
        //Populate the dictionary
        if (Object.keys(this.productToBtnDict).length == 0)
            await this.PopulateDict();

        //Get add to cart button
        const btn = this.productToBtnDict[item];

        //Throw error if item is not on store page
        if (!btn){
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

    //Returns all products on the page
    public async GetProductNames(){
        let products: string[] = [];    //List of product names

        for ( const locator of await this.productNames.all()){
            let name = await locator.textContent();
            if (name){
                products.push(name);
            }
        }

        return products;
    }
}