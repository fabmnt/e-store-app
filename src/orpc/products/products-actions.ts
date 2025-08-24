'use server';

import { ORPCError } from '@orpc/client';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import { product, store } from '@/db/schema';
import {
  productCreateSchema,
  productSchema,
  productUpdateSchema,
} from '@/features/products/schemas/product-schema';
import { protectedOs } from '../procedures';

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

    revalidatePath(`/${storeFound.slug}/products`);

    return productCreated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const deleteProductAction = protectedOs
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const { id } = input;

    await db.delete(product).where(eq(product.id, id));
    revalidatePath(`/${store.slug}/products`);
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

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

    const [productUpdated] = await db
      .update(product)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(product.id, id))
      .returning();

    if (!productUpdated) {
      throw new ORPCError('NOT_FOUND');
    }

    revalidatePath(`/${store.slug}/products`);

    return productUpdated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
