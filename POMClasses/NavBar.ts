// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the navbar
export default class NavBarPOM
{
    #page :Page;

    //Locator declarations
    #shopButton :Locator;
    #accountButton :Locator;
    #cartButton :Locator;
    #checkoutButton :Locator;

    #popup :Locator;

    constructor(page :Page) {
        this.#page = page;

        //Locators
        this.#shopButton = page.locator('#menu-main').getByRole('link', { name: 'Shop' });
        this.#accountButton = page.locator('#menu-main').getByRole('link', { name: 'My account' });
        this.#cartButton = page.locator('#menu-main').getByRole('link', { name: 'Cart' });
        this.#checkoutButton = page.locator('#menu-main').getByRole('link', { name: 'Checkout' });
        this.#popup = page.getByRole('link', { name: 'Dismiss' });
    }

    //Service methods
    public async GoShop(){
        await this.#shopButton.click();
    }

    public async GoAccount(){
        await this.#accountButton.click();
    }

    public async GoCart(){
        await this.#cartButton.click();
    }

    public async GoCheckout(){
        await this.#checkoutButton.click();
    }

    //Dismiss popup
    public async DismissPopup(){
        if (await this.#popup.isVisible()){
            await this.#popup.click();
        }
    }
}