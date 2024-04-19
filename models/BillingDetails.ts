//James Churcher
//19/04/24

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