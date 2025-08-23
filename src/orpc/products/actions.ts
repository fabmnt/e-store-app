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
  });
