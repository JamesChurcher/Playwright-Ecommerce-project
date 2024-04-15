// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the checkout page
export default class CheckoutPage
{
    #page :Page;

    //Locator declarations
    #placeOrderButton :Locator;
    #paymentCheck :Locator;
    #paymentCash :Locator;

    #firstName :Locator;
    #lastName :Locator;
    #country :Locator;
    #street :Locator;
    #city :Locator;
    #postcode :Locator;
    #phoneNumber :Locator;
    #paymentMethod :Locator;

    constructor(page :Page) {
        this.#page = page

        //Locators
        this.#placeOrderButton = page.getByRole('button', { name: 'Place order' });
        this.#paymentCheck = page.getByText("Check payments");
        this.#paymentCash = page.getByText("Cash on delivery");

        // this.#firstName = page.getByLabel('First name');
        // this.#lastName = page.getByLabel('Last name');
        // this.#country = page.getByLabel('Country');
        // this.#street = page.getByLabel('Street address');
        // this.#city = page.getByLabel('Town / City');
        // this.#postcode = page.getByLabel('Postcode');
        // this.#phoneNumber = page.getByLabel('Phone');
        // this.#paymentMethod = null;

        this.#firstName = page.getByRole('textbox', { name: 'First name' });
        this.#lastName = page.getByRole('textbox', { name: 'Last name' });
        this.#country = page.locator('#billing_country');
        this.#street = page.getByRole('textbox', { name: 'Street address' });
        this.#city = page.getByRole('textbox', { name: 'Town / City' });
        this.#postcode = page.getByRole('textbox', { name: 'Postcode' });
        this.#phoneNumber = page.getByLabel('Phone');
        // this.#paymentMethod = null;
    }

    //Service methods
    public async PlaceOrder(){
        await this.#placeOrderButton.click();
    }

    public async ClickCheck(){
        await this.#paymentCheck.click();
    }

    public async ClickCash(){
        await this.#paymentCash.click();
    }

    public async SetFirstName(firstName :string){
        await this.#firstName.fill(firstName);
    }

    public async SetLastName(lastName :string){
        await this.#lastName.fill(lastName);
    }

    public async SelectCountry(country :string){
        await this.#country.selectOption(country);
    }

    public async SetStreet(street :string){
        await this.#street.fill(street);
    }

    public async SetCity(city :string){
        await this.#firstName.fill(city);
    }

    public async SetPostcode(postcode :string){
        await this.#postcode.fill(postcode);
    }

    public async SetPhoneNumber(phoneNumber :string){
        await this.#phoneNumber.fill(phoneNumber);
    }

    //Higher level service methods
    public async SetBillingInfo(fn, ln, co, st, cty, pc, pn){
        await this.SetFirstName(fn);
        await this.SetLastName(ln);
        await this.SelectCountry(co);
        await this.SetStreet(st);
        await this.SetCity(cty);
        await this.SetPostcode(pc);
        await this.SetPhoneNumber(pn);
    }

    public async CheckoutExpectSuccess(){
        
    }
}