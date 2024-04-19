// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

import { ShopPage, AccountPage, CartPage, CheckoutPage, LoginPage } from "./POMClasses";

//A POM class for the navbar
export default class NavBar extends BasePOM
{
    //Locator declarations
    #shopButton: Locator = this.page.locator('#menu-main').getByRole('link', { name: 'Shop' });
    #accountButton: Locator = this.page.locator('#menu-main').getByRole('link', { name: 'My account' });
    #cartButton: Locator = this.page.locator('#menu-main').getByRole('link', { name: 'Cart' });
    #checkoutButton: Locator = this.page.locator('#menu-main').getByRole('link', { name: 'Checkout' });
    #popup: Locator = this.page.getByRole('link', { name: 'Dismiss' });

    constructor(page :Page) {
        super(page);
    }

    //---Service methods---
    public async GoShop(){
        await this.#shopButton.click();
        await this.page.waitForURL(/shop/);

        return new ShopPage(this.page);
    }

    public async GoAccount(){
        await this.#accountButton.click();
        await this.page.waitForURL(/account/);

        return new AccountPage(this.page);
    }
    
    public async GoLogin(){
        await this.#accountButton.click();
        await this.page.waitForURL(/account/);

        return new LoginPage(this.page);
    }

    public async GoCart(){
        await this.#cartButton.click();
        await this.page.waitForURL(/cart/);

        return new CartPage(this.page);
    }

    public async GoCheckout(){
        await this.#checkoutButton.click();
        await this.page.waitForURL(/checkout/);
        
        return new CheckoutPage(this.page);
    }

    //Dismiss popup
    public async DismissPopup(){
        if (await this.#popup.isVisible()){
            await this.#popup.click();
        }
    }
}