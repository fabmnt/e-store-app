import { categoriesQueries } from './categories/categories-queries';
import { productQueries } from './products/products-queries';
import { storesQueries } from './stores/stores-queries';
import { storeImagesQueries } from './stores-images/queries';
import { tagsQueries } from './tags/tags-queries';

export const router = {
  stores: storesQueries,
  products: productQueries,
  categories: categoriesQueries,
  tags: tagsQueries,
  storeImages: storeImagesQueries,
};
