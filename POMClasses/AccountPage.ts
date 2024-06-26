// James Churcher
// 03/04/24

import { Locator, Page, expect } from "@playwright/test";
import BasePOM from "./BasePOM";

import { AccountOrdersPage, LoginPage } from "./POMClasses";

//A POM class to represent the account page
export default class AccountPage extends BasePOM
{
    //Locator declarations
    private readonly navBar: Locator = this.page.locator(".entry-content").getByRole('list');
    private readonly ordersButton: Locator = this.navBar.getByText("Orders");
    private readonly logoutButton: Locator = this.navBar.getByText("Logout");
    private readonly loginButton: Locator = this.page.getByRole('button', { name: 'Log in' });

    constructor(page: Page) {
        super(page);
    }

    //---Service methods---
    public async GoAccountOrders(){
        await this.ordersButton.click();
        
        return new AccountOrdersPage(this.page);
    }

    //---High-level service methods---

    //Log out of the account successfully
    public async LogoutExpectSuccess(){
        await this.logoutButton.click();

        //Confirm we can logout
        await expect(this.loginButton, "Could not logout").toBeVisible();
        
        return new LoginPage(this.page);
    }
}