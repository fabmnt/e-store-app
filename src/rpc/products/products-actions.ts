'use server';

import { ORPCError } from '@orpc/client';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import {
  product,
  productDetail,
  productImage,
  productTag,
  store,
} from '@/db/schema';
import {
  productCreateSchema,
  productDetailSchema,
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

    const { details, tags, ...productData } = input;

    const [productCreated] = await db
      .insert(product)
      .values(productData)
      .returning();

    if (!productCreated) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    const newDetails = details?.map((detail) => ({
      ...detail,
      productId: productCreated.id,
    }));

    if (newDetails) {
      await db.insert(productDetail).values(newDetails);
    }

    if (tags && tags.length > 0) {
      const rows = tags.map((tag) => ({
        productId: productCreated.id,
        tagId: tag.id,
      }));
      await db.insert(productTag).values(rows);
    }

    const productWithRelations = await db.query.product.findFirst({
      where: eq(product.id, productCreated.id),
      with: {
        category: true,
        store: true,
        details: true,
        images: true,
        productTags: { with: { tag: true } },
      },
    });

    if (!productWithRelations) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${storeFound.id}/products`);

    const result = {
      ...productWithRelations,
      tags: productWithRelations.productTags.map((pt) => pt.tag),
    };

    return result;
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
        details: true,
        images: true,
        productTags: { with: { tag: true } },
      },
    });

    if (!productWithRelations) {
      throw new ORPCError('NOT_FOUND');
    }

    const result = {
      ...productWithRelations,
      tags: productWithRelations.productTags.map((pt) => pt.tag),
    };

    revalidatePath(`/d/${productWithRelations.store.id}/products`);

    return result;
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
      .where(eq(product.id, id));
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const addProductDetail = protectedOs
  .input(
    z.object({
      productId: z.string(),
      detail: z.string(),
    })
  )
  .output(productDetailSchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Could not add detail',
    },
    NOT_FOUND: {
      message: 'Product not found',
    },
  })
  .handler(async ({ input }) => {
    const { productId, detail } = input;

    const productWithRelations = await db.query.product.findFirst({
      where: eq(product.id, productId),
      with: {
        store: true,
        productTags: { with: { tag: true } },
      },
    });

    if (!productWithRelations) {
      throw new ORPCError('NOT_FOUND');
    }

    const [newDetail] = await db
      .insert(productDetail)
      .values({
        productId,
        content: detail,
      })
      .returning();

    if (!newDetail) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${productWithRelations.store.id}/products`);

    return newDetail;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const updateProductDetail = protectedOs
  .input(
    z.object({
      id: z.string(),
      detail: z.string(),
    })
  )
  .output(productDetailSchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Could not update detail',
    },
    NOT_FOUND: {
      message: 'Product not found',
    },
  })
  .handler(async ({ input }) => {
    const { id, detail } = input;

    const productDetailFound = await db.query.productDetail.findFirst({
      where: eq(productDetail.id, id),
      with: {
        product: {
          with: {
            store: true,
          },
        },
      },
    });

    if (!productDetailFound) {
      throw new ORPCError('NOT_FOUND');
    }

    const [updatedDetail] = await db
      .update(productDetail)
      .set({ content: detail, updatedAt: new Date() })
      .where(eq(productDetail.id, id))
      .returning();

    if (!updatedDetail) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${productDetailFound.product.store.id}/products`);

    return updatedDetail;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const deleteProductDetail = protectedOs
  .input(z.object({ id: z.string() }))
  .output(productDetailSchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Could not delete detail',
    },
    NOT_FOUND: {
      message: 'Product not found',
    },
  })
  .handler(async ({ input }) => {
    const { id } = input;

    const productWithRelations = await db.query.product.findFirst({
      where: eq(productDetail.id, id),
      with: {
        store: true,
      },
    });

    if (!productWithRelations) {
      throw new ORPCError('NOT_FOUND');
    }

    const [deletedDetail] = await db
      .delete(productDetail)
      .where(eq(productDetail.id, id))
      .returning();

    if (!deletedDetail) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${productWithRelations.store.id}/products`);

    return deletedDetail;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
