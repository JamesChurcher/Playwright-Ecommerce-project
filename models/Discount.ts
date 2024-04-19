//James Churcher
//19/04/24

import data from '../testData/discounts.json';

// Interface to describe information about a discount code

export default interface DiscountData {
	code: string;
	value: number;
}

export const discountsData: DiscountData[] = data;