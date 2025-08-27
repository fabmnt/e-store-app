import { desc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { product } from '@/db/schema';
import { productWithImagesSchema } from '@/features/products/schemas/product-schema';
import { protectedOs, publicOs } from '../procedures';

export const productQueries = {
  public: {
    getAllByStoreId: publicOs
      .input(
        z.object({
          storeId: z.uuid(),
        })
      )
      .output(productWithImagesSchema.array())
      .handler(async ({ input }) => {
        const products = await db.query.product.findMany({
          where: eq(product.storeId, input.storeId),
          with: {
            category: true,
            store: true,
            images: true,
          },
          orderBy: [desc(product.createdAt)],
        });

        return products;
      }),
  },
  protected: {
    getAllByStoreId: protectedOs
      .input(
        z.object({
          storeId: z.uuid(),
        })
      )
      .output(productWithImagesSchema.array())
      .handler(async ({ input }) => {
        const products = await db.query.product.findMany({
          where: eq(product.storeId, input.storeId),
          with: {
            category: true,
            store: true,
            images: true,
          },
          orderBy: [desc(product.createdAt)],
        });

        return products;
      }),
  },
};
