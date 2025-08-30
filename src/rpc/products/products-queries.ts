import { ORPCError } from '@orpc/server';
import { and, desc, eq, exists, ilike, not, or } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import {
  category,
  product,
  productDetail,
  productTag,
  store,
} from '@/db/schema';
import { productExtendedSchema } from '@/features/products/schemas/product-schema';
import { protectedOs, publicOs } from '../procedures';

export const productQueries = {
  public: {
    getBySlug: publicOs
      .errors({
        NOT_FOUND: {
          message: 'Product not found',
        },
      })
      .input(
        z.object({
          storeSlug: z.string(),
          productSlug: z.string(),
        })
      )
      .output(productExtendedSchema)
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.slug, input.storeSlug),
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        const productFound = await db.query.product.findFirst({
          where: and(
            eq(product.slug, input.productSlug),
            eq(product.storeId, storeFound.id)
          ),
          with: {
            category: true,
            store: true,
            images: true,
            productTags: {
              with: {
                tag: true,
              },
            },
            details: {
              orderBy: [desc(productDetail.createdAt)],
            },
          },
        });

        if (!productFound) {
          throw new ORPCError('NOT_FOUND');
        }

        return {
          ...productFound,
          tags: productFound.productTags.map((pt) => pt.tag),
        };
      }),
    getAllByStoreId: publicOs
      .input(
        z.object({
          storeId: z.uuid(),
          query: z.string().optional(),
        })
      )
      .output(productExtendedSchema.array())
      .handler(async ({ input }) => {
        const products = await db.query.product.findMany({
          where: and(
            eq(product.storeId, input.storeId),
            or(
              input.query ? ilike(product.name, `%${input.query}%`) : undefined,
              input.query
                ? ilike(product.description, `%${input.query}%`)
                : undefined
            )
          ),
          with: {
            category: true,
            store: true,
            images: true,
            details: {
              orderBy: [desc(productDetail.createdAt)],
            },
            productTags: {
              with: {
                tag: true,
              },
            },
          },
          orderBy: [desc(product.createdAt)],
        });

        return products.map((p) => ({
          ...p,
          tags: p.productTags.map((pt) => pt.tag),
        }));
      }),
    getAllByCategorySlug: publicOs
      .input(
        z.object({
          storeSlug: z.string(),
          categorySlug: z.string().optional(),
          query: z.string().optional(),
          queryTag: z.string().optional(),
        })
      )
      .output(productExtendedSchema.array())
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.slug, input.storeSlug),
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        if (!input.categorySlug) {
          const products = await db.query.product.findMany({
            where: and(
              eq(product.storeId, storeFound.id),
              input.queryTag
                ? exists(
                    db
                      .select()
                      .from(productTag)
                      .where(
                        and(
                          eq(productTag.productId, product.id),
                          eq(productTag.tagId, input.queryTag)
                        )
                      )
                  )
                : undefined,
              or(
                input.query
                  ? ilike(product.name, `%${input.query}%`)
                  : undefined,
                input.query
                  ? ilike(product.description, `%${input.query}%`)
                  : undefined
              )
            ),
            with: {
              category: true,
              store: true,
              images: true,
              details: true,
              productTags: {
                with: {
                  tag: true,
                },
              },
            },
          });

          return products.map((p) => ({
            ...p,
            tags: p.productTags.map((pt) => pt.tag),
          }));
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
          where: and(
            eq(product.categoryId, categoryFound.id),
            input.queryTag
              ? exists(
                  db
                    .select()
                    .from(productTag)
                    .where(
                      and(
                        eq(productTag.productId, product.id),
                        eq(productTag.tagId, input.queryTag)
                      )
                    )
                )
              : undefined,
            or(
              input.query ? ilike(product.name, `%${input.query}%`) : undefined,
              input.query
                ? ilike(product.description, `%${input.query}%`)
                : undefined
            )
          ),
          with: {
            category: true,
            store: true,
            images: true,
            details: {
              orderBy: [desc(productDetail.createdAt)],
            },
            productTags: {
              with: {
                tag: true,
              },
            },
          },
        });

        return products.map((p) => ({
          ...p,
          tags: p.productTags.map((pt) => pt.tag),
        }));
      }),
  },
  protected: {
    getAllByStoreId: protectedOs
      .input(
        z.object({
          storeId: z.uuid(),
        })
      )
      .output(productExtendedSchema.array())
      .handler(async ({ input }) => {
        const products = await db.query.product.findMany({
          where: eq(product.storeId, input.storeId),
          with: {
            category: true,
            store: true,
            images: true,
            details: {
              orderBy: [desc(productDetail.createdAt)],
            },
            productTags: {
              with: {
                tag: true,
              },
            },
          },
          orderBy: [desc(product.createdAt)],
        });

        const result = products.map((p) => ({
          ...p,
          tags: p.productTags.map((pt) => pt.tag),
        }));

        return result;
      }),
    isSlugAvailable: protectedOs
      .input(
        z.object({
          slug: z.string(),
          storeId: z.uuid(),
          omitId: z.string().optional(),
        })
      )
      .output(z.boolean())
      .handler(async ({ input }) => {
        if (input.omitId) {
          const productFound = await db.query.product.findFirst({
            where: and(
              eq(product.slug, input.slug),
              eq(product.storeId, input.storeId),
              not(eq(product.id, input.omitId))
            ),
          });

          return !productFound;
        }

        const productFound = await db.query.product.findFirst({
          where: and(
            eq(product.slug, input.slug),
            eq(product.storeId, input.storeId)
          ),
        });

        return !productFound;
      }),
  },
};
