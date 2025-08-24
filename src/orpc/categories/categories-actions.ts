'use server';

import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import { category, store } from '@/db/schema';
import {
  categoryCreateSchema,
  categorySchema,
  categoryUpdateSchema,
} from '@/features/categories/schemas/category-schema';
import { protectedOs } from '../procedures';

export const createCategoryAction = protectedOs
  .input(categoryCreateSchema)
  .output(categorySchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to create category',
    },
  })
  .handler(async ({ input }) => {
    const [categoryCreated] = await db
      .insert(category)
      .values(input)
      .returning();

    if (!categoryCreated) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    const storeFound = await db.query.store.findFirst({
      where: eq(store.id, input.storeId),
      columns: {
        slug: true,
      },
    });

    if (!storeFound) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/${storeFound.slug}/categories`);
    return categoryCreated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const updateCategoryAction = protectedOs
  .input(categoryUpdateSchema)
  .output(categorySchema)
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to update category',
    },
  })
  .handler(async ({ input }) => {
    const [categoryUpdated] = await db
      .update(category)
      .set(input)
      .where(eq(category.id, input.id))
      .returning();

    if (!categoryUpdated) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    const storeFound = await db.query.store.findFirst({
      where: eq(store.id, input.storeId),
      columns: {
        slug: true,
      },
    });

    if (!storeFound) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/${storeFound.slug}/categories`);
    return categoryUpdated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const deleteCategoryAction = protectedOs
  .input(z.object({ id: z.string(), storeId: z.string() }))
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Failed to delete category',
    },
  })
  .handler(async ({ input }) => {
    try {
      await db.delete(category).where(eq(category.id, input.id));
    } catch (_e) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/${input.storeId}/categories`);
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
