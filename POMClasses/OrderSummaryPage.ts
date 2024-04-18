// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

//A POM class for the order summar page appearing after checkout
export default class OrderSummaryPage extends BasePOM
{
    //Locator declarations
    #orderNumber: Locator = this.page.getByText("Order number");

    constructor(page :Page) {
        super(page)
    }

    //---Service methods---
    public async GetOrderNumber(){
        return (await this.#orderNumber.innerText()).replace(/\D/g, "");
    }
}