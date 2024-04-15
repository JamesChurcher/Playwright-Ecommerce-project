// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class to represent the account page
export default class AccountPagePOM
{
    #page :Page;

    //Locator declarations
    #navBar :Locator;
    #ordersButton :Locator;
    #logoutButton :Locator;

    constructor(page: Page) {
        this.#page = page;

        //Locators
        this.#navBar = page.locator(".entry-content").getByRole('list');
        this.#ordersButton = this.#navBar.getByText("Orders");
        this.#logoutButton = this.#navBar.getByText("Logout");
    }

    //Service methods
    public async GoAccountOrders(){
        await this.#ordersButton.click();
    }

    public async Logout(){
        await this.#logoutButton.click();
    }
}