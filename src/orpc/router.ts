import { categoriesRouter } from './categories-router';
import { productsRouter } from './products-router';
import { storeImagesQueries } from './stores-images/queries';
import { storeRouter } from './stores-router';

export const router = {
  stores: storeRouter,
  products: productsRouter,
  categories: categoriesRouter,
  storeImages: storeImagesQueries,
};
