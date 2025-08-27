import { ORPCError } from '@orpc/server';
import { and, desc, eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { category, product, store } from '@/db/schema';
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
    getAllByCategorySlug: publicOs
      .input(
        z.object({
          storeSlug: z.string(),
          categorySlug: z.string().optional(),
        })
      )
      .output(productWithImagesSchema.array())
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.slug, input.storeSlug),
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        if (!input.categorySlug) {
          const products = await db.query.product.findMany({
            where: eq(product.storeId, storeFound.id),
            with: {
              category: true,
              store: true,
              images: true,
            },
          });

          return products;
        }

        const categoryFound = await db.query.category.findFirst({
          where: and(
            eq(category.slug, input.categorySlug),
            eq(category.storeId, storeFound.id)
          ),
        });

        if (!categoryFound) {
          return [];
        }

        const products = await db.query.product.findMany({
          where: eq(product.categoryId, categoryFound.id),
          with: {
            category: true,
            store: true,
            images: true,
          },
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
