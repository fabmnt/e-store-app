'use server';

import { ORPCError } from '@orpc/client';
import { onError } from '@orpc/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import { product, productImage, store } from '@/db/schema';
import {
  productCreateSchema,
  productSchema,
  productUpdateSchema,
} from '@/features/products/schemas/product-schema';
import { utapi } from '@/server/utapi';
import { protectedOs, publicOs } from '../procedures';

export const createProductAction = protectedOs
  .input(productCreateSchema)
  .output(productSchema)
  .errors({
    NOT_FOUND: {
      message: 'Store not found',
    },
  })
  .handler(async ({ input }) => {
    const storeFound = await db.query.store.findFirst({
      where: eq(store.id, input.storeId),
    });

    if (!storeFound) {
      throw new ORPCError('NOT_FOUND');
    }

    const [productCreated] = await db.insert(product).values(input).returning();

    if (!productCreated) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    const productWithRelations = await db.query.product.findFirst({
      where: eq(product.id, productCreated.id),
      with: {
        category: true,
        store: true,
      },
    });

    if (!productWithRelations) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${storeFound.id}/products`);

    return productWithRelations;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const deleteProductAction = protectedOs
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const { id } = input;

    const deletedProductImages = await db.query.productImage.findMany({
      where: eq(productImage.productId, id),
    });

    const deleteProductFilesPromises = deletedProductImages.map(
      (deletedProductImage) => utapi.deleteFiles(deletedProductImage.fileKey)
    );

    await Promise.all(deleteProductFilesPromises);
    await db.delete(productImage).where(eq(productImage.productId, id));

    const [productFound] = await db
      .delete(product)
      .where(eq(product.id, id))
      .returning();

    if (!productFound) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${productFound.storeId}/products`);
  })
  .actionable({
    context: async () => ({ headers: await headers() }),
    interceptors: [
      onError(async (err) => {
        await console.log(err);
      }),
    ],
  });

export const updateProductAction = protectedOs
  .input(productUpdateSchema)
  .output(productSchema)
  .errors({
    NOT_FOUND: {
      message: 'Product not found',
    },
  })
  .handler(async ({ input }) => {
    const { id, ...data } = input;

    await db
      .update(product)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(product.id, id));

    const productWithRelations = await db.query.product.findFirst({
      where: eq(product.id, id),
      with: {
        category: true,
        store: true,
      },
    });

    if (!productWithRelations) {
      throw new ORPCError('NOT_FOUND');
    }

    revalidatePath(`/d/${productWithRelations.store.id}/products`);

    return productWithRelations;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const addClickToProductAction = publicOs
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const { id } = input;

    await db
      .update(product)
      .set({
        clicks: sql`${product.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(product.id, id))
      .returning();
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
