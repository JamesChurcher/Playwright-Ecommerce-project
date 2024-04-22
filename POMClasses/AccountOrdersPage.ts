// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

//A POM class to represent the account orders list page
export default class AccountPage extends BasePOM
{
    //Locator declarations
    #orders: Locator = this.page.getByRole('link', { name: /#\d+/ });

    constructor(page: Page) {
        super(page);
    }

    //---Service methods---

    //Get all order numbers listed under this account
    public async GetAccountOrders(){
        let orderNumbers: string[] = []
        for (let order of await this.#orders.all()){
            let text = await order.innerText();
            orderNumbers.push(text.replace(/\D/g, ""));
        }

        return orderNumbers
    }
}