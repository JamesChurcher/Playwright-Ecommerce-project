// James Churcher
// 03/04/24

import { Locator, Page, expect } from "@playwright/test";
import BasePOM from "./BasePOM";

import { AccountPage } from "./POMClasses";

//A POM class to represent the login page
export default class LoginPage extends BasePOM
{
    //Locator declarations
    private readonly usernameField: Locator = this.page.getByLabel("username");
    private readonly passwordField: Locator = this.page.locator('#password');
    private readonly submitButton: Locator = this.page.getByRole("button", { name:  "Log in" });
    private readonly logoutButton: Locator = this.page.getByRole('link', { name: 'Logout' });

    constructor(page: Page) {
        super(page);
    }

    //---Service methods---
    public async SetUsername(username: string){
        await this.usernameField.click();
        await this.usernameField.fill(username);
    }

    public async SetPassword(password: string){
        await this.passwordField.click();
        await this.passwordField.fill(password);
    }

    public async SubmitLogin(){
        await this.submitButton.click();
    }

    //---High-level service methods---

    //Log into an account successfully
    public async LoginExpectSuccess(username: string, password: string){
        await this.SetUsername(username);
        await this.SetPassword(password);
        await this.SubmitLogin();

        //Confirm we can login
        await expect(this.logoutButton, "Could not login").toBeVisible();
        
        return new AccountPage(this.page);
    }
}