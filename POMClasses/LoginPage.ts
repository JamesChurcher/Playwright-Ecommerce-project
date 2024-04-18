// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

//A POM class to represent the login page
export default class LoginPage extends BasePOM
{
    //Locator declarations
    #usernameField: Locator = this.page.getByLabel("username");
    #passwordField: Locator = this.page.locator('#password');
    #submitButton: Locator = this.page.getByRole("button", { name : "Log in" });
    #logoutButton: Locator = this.page.getByRole('link', { name: 'Logout' });

    constructor(page: Page) {
        super(page);
    }

    //---Service methods---
    public async SetUsername(username :string){
        await this.#usernameField.click();
        await this.#usernameField.fill(username);
    }

    public async SetPassword(password :string){
        await this.#passwordField.click();
        await this.#passwordField.fill(password);
    }

    public async SubmitLogin(){
        await this.#submitButton.click();
    }

    //---High-level service methods---

    //Log into an account successfully
    public async LoginExpectSuccess(username :string, password :string){
        await this.SetUsername(username);
        await this.SetPassword(password);
        await this.SubmitLogin();
        
        try {
            await this.#logoutButton.waitFor({state: 'visible', timeout: 4000});        //Wait for logout link to show
        }
        catch (error){
            error.message = "Could not login\n" + error.message;        //Throw an error if we could not login properly
            throw error;
        }
    }
}