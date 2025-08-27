import { categoriesQueries } from './categories/categories-queries';
import { productQueries } from './products/products-queries';
import { storesQueries } from './stores/stores-queries';
import { storeImagesQueries } from './stores-images/queries';

export const router = {
  stores: storesQueries,
  products: productQueries,
  categories: categoriesQueries,
  storeImages: storeImagesQueries,
};
