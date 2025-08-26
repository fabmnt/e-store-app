import { desc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { product } from '@/db/schema';
import { productWithImagesSchema } from '@/features/products/schemas/product-schema';
import { publicOs } from './procedures';

export const productsRouter = {
  getAllByStoreId: publicOs
    .input(
      z.object({
        storeId: z.string(),
        by: z.enum(['clicks', 'createdAt']).optional().default('createdAt'),
      })
    )
    .output(z.array(productWithImagesSchema))
    .handler(async ({ input }) => {
      const productsFound = await db.query.product.findMany({
        where: eq(product.storeId, input.storeId),
        orderBy: [
          desc(input.by === 'clicks' ? product.clicks : product.createdAt),
        ],
        with: {
          category: true,
          store: true,
          images: true,
        },
      });

      return productsFound;
    }),
};
