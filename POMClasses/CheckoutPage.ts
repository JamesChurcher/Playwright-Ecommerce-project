// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";
import BasePOM from "./BasePOM";

//A POM class for the checkout page
export default class CheckoutPage extends BasePOM
{
    //Locator declarations
    #placeOrderButton: Locator = this.page.getByRole('button', { name: 'Place order' });
    
    #firstName: Locator = this.page.locator('#billing_first_name');
    #lastName: Locator = this.page.locator('#billing_last_name');
    #country: Locator = this.page.locator('#billing_country');
    #street: Locator = this.page.locator('#billing_address_1');
    #city: Locator = this.page.locator('#billing_city');
    #postcode: Locator = this.page.locator('#billing_postcode');
    #phoneNumber: Locator = this.page.getByLabel('Phone');

    #paymentMethods = {
        "cheque": this.page.getByText('Check payments'),
        "cod": this.page.getByText('Cash on delivery'),
    }

    constructor(page :Page) {
        super(page)
    }

    //---Service methods---
    public async PlaceOrder(){
        await this.#placeOrderButton.click();
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
        await this.#city.fill(city);
    }

    public async SetPostcode(postcode :string){
        await this.#postcode.fill(postcode);
    }

    public async SetPhoneNumber(phoneNumber :string){
        await this.#phoneNumber.fill(phoneNumber);
    }

    public async SelectPaymentMethod(paymentMethod :string){
        await this.#paymentMethods[paymentMethod].click();
    }

    //---Higher level service methods---
    public async CheckoutExpectSuccess(billingDetails){
        //Set text fields
        await this.SetFirstName(billingDetails.firstName);
        await this.SetLastName(billingDetails.lastName);
        await this.SetStreet(billingDetails.street);
        await this.SetCity(billingDetails.city);
        await this.SetPostcode(billingDetails.postcode);
        await this.SetPhoneNumber(billingDetails.phoneNumber);

        //Select from dropdown
        await this.SelectCountry(billingDetails.country);

        //Set payment method
        await this.SelectPaymentMethod(billingDetails.paymentMethod);

        //Checkout
        await this.PlaceOrder();

        //Wait for order summary page
        try {
            await this.page.waitForURL(/order-received/, {timeout: 4000});
        }
        catch (error){
            error.message = "Could not place order, we are not currently on the order summary page\n" + error.message;      //Throw error if we are not on the correct page
            throw error;
        }
    }
}