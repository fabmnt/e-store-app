'use server';

import { ORPCError, onError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import { productImage } from '@/db/schema';
import {
  createProductImageSchema,
  productImageSchema,
} from '@/features/products-images/schemas/product-images-schema';
import { utapi } from '@/server/utapi';
import { protectedOs } from '../procedures';

export const createProductImage = protectedOs
  .input(createProductImageSchema)
  .output(productImageSchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to create product image',
    },
  })
  .handler(async ({ input }) => {
    const [createdProductImage] = await db
      .insert(productImage)
      .values({
        ...input,
      })
      .returning();

    if (!createdProductImage) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    return createdProductImage;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const deleteProductImage = protectedOs
  .input(
    z.object({
      id: z.string(),
      fileKey: z.string(),
      storeId: z.string(),
    })
  )
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to delete product image',
    },
    NOT_FOUND: {
      message: 'Product image not found',
    },
  })
  .handler(async ({ input }) => {
    await utapi.deleteFiles(input.fileKey);
    await db.delete(productImage).where(eq(productImage.id, input.id));
    revalidatePath(`/${input.storeId}/products`);
  })
  .actionable({
    context: async () => ({ headers: await headers() }),
    interceptors: [
      onError(async (err) => {
        await console.log(err);
      }),
    ],
  });
