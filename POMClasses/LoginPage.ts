// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class to represent the login page
export default class LoginPagePOM
{
    readonly page :Page;

    //Locator declarations
    #usernameField :Locator;
    #passwordField :Locator;
    #submitButton :Locator;
    #logoutButton :Locator;

    //Wait declarations
    // #loggedInWait :Promise<void>;

    constructor(page: Page) {
        this.page = page;

        //Locators
        this.#usernameField = page.getByLabel("username");
        this.#passwordField = page.locator('#password');
        this.#submitButton = page.getByRole("button", { name : "Log in" });
        this.#logoutButton = page.getByRole('link', { name: 'Logout' });

        //Waits
        // this.#loggedInWait = page.getByRole('link', { name: 'Logout' }).waitFor({state: 'visible', timeout: 4000});
    }

    //Service methods
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

    //High-level service methods
    public async Login(username :string, password :string){
        await this.SetUsername(username);
        await this.SetPassword(password);
        await this.SubmitLogin();
        
        try {
            await this.#logoutButton.waitFor({state: 'visible', timeout: 4000});
        }
        catch (error){
            error.message = "Could not login\n" + error.message;
            throw error;
        }
    }
}