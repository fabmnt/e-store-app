import { desc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { product } from '@/db/schema';
import { productSchema } from '@/features/products/schemas/product-schema';
import { publicOs } from '../procedures';

export const productQueries = {
  getAll: publicOs
    .input(
      z.object({
        storeId: z.uuid(),
      })
    )
    .output(productSchema.array())
    .handler(async ({ input }) => {
      const products = await db.query.product.findMany({
        where: eq(product.storeId, input.storeId),
        with: {
          category: true,
          store: true,
        },
        orderBy: [desc(product.createdAt)],
      });

      return products;
    }),
};
