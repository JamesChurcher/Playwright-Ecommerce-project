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

    //Wait declarations
    // #loggedOutWait :Promise<void>;

    constructor(page: Page) {
        this.page = page;

        //Locators
        this.#navBar = page.locator(".entry-content").getByRole('list');
        this.#ordersButton = this.#navBar.getByText("Orders");
        this.#logoutButton = this.#navBar.getByText("Logout");

        //Waits
        // this.#loggedOutWait = page.getByRole('button', { name: 'Log in' }).waitFor({state: 'visible', timeout: 4000});
    }

    //Service methods
    public async GoAccountOrders(){
        await this.#ordersButton.click();
    }

    public async Logout(){
        await this.#logoutButton.click();
        
        try {
            // await this.#loggedOutWait;
            await this.page.getByRole('button', { name: 'Log in' }).waitFor({state: 'visible', timeout: 4000});
        }
        catch (error){
            error.message = "Could not logout\n" + error.message;
            throw error;    
        }
    }
}