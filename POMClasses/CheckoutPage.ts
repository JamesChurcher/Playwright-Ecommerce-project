// James Churcher
// 03/04/24

import { Locator, Page } from "@playwright/test";

//A POM class for the checkout page
export default class CheckoutPage
{
    #page :Page;

    //Locator declarations
    #placeOrderButton :Locator;

    #firstName :Locator;
    #lastName :Locator;
    #country :Locator;
    #street :Locator;
    #city :Locator;
    #postcode :Locator;
    #phoneNumber :Locator;
    #paymentMethods;

    //Attributes
    #orderReceivedWait :Promise<any>;

    constructor(page :Page) {
        this.#page = page

        //Locators
        this.#placeOrderButton = page.getByRole('button', { name: 'Place order' });
        
        this.#firstName = page.locator('#billing_first_name');
        this.#lastName = page.locator('#billing_last_name');
        this.#country = page.locator('#billing_country');
        this.#street = page.locator('#billing_address_1');
        this.#city = page.locator('#billing_city');
        this.#postcode = page.locator('#billing_postcode');
        this.#phoneNumber = page.getByLabel('Phone');

        this.#paymentMethods = {
            "cheque": page.getByText('Check payments'),
            "cod": page.getByText('Cash on delivery'),
        }
        
        this.#orderReceivedWait = this.#page.waitForURL(/\/order-received\//);
    }

    //Service methods
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

    //Higher level service methods
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
        await this.#orderReceivedWait;
    }
}