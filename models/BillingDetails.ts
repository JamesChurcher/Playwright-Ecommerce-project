//James Churcher
//19/04/24

import data from '../testData/billingDetails.json';

// Interface to describe customer billing information

export default interface BillingDetailsData {
	firstName: string;
	lastName: string;
	country: string;
	street: string;
	city: string;
	postcode: string;
	phoneNumber: string;
	paymentMethod: string;
}

export const billingDetailsData: BillingDetailsData[] = data;