// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the order summar page appearing after checkout
export default class OrderSummaryPagePOM
{
    readonly page :Page;

    //Locator declarations
    #orderNumber :Locator;

    constructor(page :Page) {
        this.page = page

        //Locators
        this.#orderNumber = page.getByText("Order number");
    }

    //---Service methods---
    public async GetOrderNumber(){
        return (await this.#orderNumber.innerText()).replace(/\D/g, "");
    }
}