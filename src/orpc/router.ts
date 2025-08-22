import { productsRouter } from './products-router';
import { storeRouter } from './stores-router';

export const router = {
  stores: storeRouter,
  products: productsRouter,
};
