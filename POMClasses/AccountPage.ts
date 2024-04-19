// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

import { AccountOrdersPage, LoginPage } from "./POMClasses";

//A POM class to represent the account page
export default class AccountPage extends BasePOM
{
    //Locator declarations
    #navBar: Locator = this.page.locator(".entry-content").getByRole('list');
    #ordersButton: Locator = this.#navBar.getByText("Orders");
    #logoutButton: Locator = this.#navBar.getByText("Logout");
    #loginButton: Locator = this.page.getByRole('button', { name: 'Log in' });

    constructor(page: Page) {
        super(page);
    }

    //---Service methods---
    public async GoAccountOrders(){
        await this.#ordersButton.click();
        
        return new AccountOrdersPage(this.page);
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
        
        return new LoginPage(this.page);
    }
}