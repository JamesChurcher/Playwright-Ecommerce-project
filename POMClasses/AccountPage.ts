// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class to represent the account page
export default class AccountPagePOM
{
    readonly page :Page;

    //Locator declarations
    #navBar :Locator;
    #ordersButton :Locator;
    #logoutButton :Locator;
    #loginButton :Locator;

    constructor(page: Page) {
        this.page = page;

        //Locators
        this.#navBar = page.locator(".entry-content").getByRole('list');
        this.#ordersButton = this.#navBar.getByText("Orders");
        this.#logoutButton = this.#navBar.getByText("Logout");
        this.#loginButton = this.page.getByRole('button', { name: 'Log in' });
    }

    //---Service methods---
    public async GoAccountOrders(){
        await this.#ordersButton.click();
    }

    //---High-level service methods---

    //Log out of the account successfully
    public async LogoutExpectSuccess(){
        await this.#logoutButton.click();
        
        //Wait for logout
        try {
            await this.#loginButton.waitFor({state: 'visible', timeout: 4000});     //Wait for the login button to show
        }
        catch (error){
            error.message = "Could not logout\n" + error.message;       //Throw an error if we could not logout properly
            throw error;    
        }
    }
}