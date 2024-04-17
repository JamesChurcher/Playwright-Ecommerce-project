// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class to represent the account orders list page
export default class AccountPagePOM
{
    readonly page :Page;

    //Locator declarations
    #ordersTable :Locator;
    #orders :Locator;

    constructor(page: Page) {
        this.page = page;

        //Locators
        this.#ordersTable = page.getByRole('table');
        this.#orders = page.getByRole('link', { name: '#' });
    }

    //Service methods
    public async GetAccountOrders(){
        let orderNumbers :string[] = []
        for (let order of await this.#orders.all()){
            let text = await order.innerText();
            orderNumbers.push(text.replace(/\D/g, ""));
        }

        return orderNumbers
    }
}