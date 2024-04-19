//James Churcher
//19/04/24

import data from '../testData/products.json';

// Interface to describe information about a product on the store

export default interface ProductData {
	product: string;
}

export const productsData: ProductData[] = data;