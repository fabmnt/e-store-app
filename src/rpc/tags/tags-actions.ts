'use server';

import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import { tag } from '@/db/schema';
import {
  tagCreateSchema,
  tagSchema,
  tagUpdateSchema,
} from '@/features/products/schemas/product-schema';
import { protectedOs } from '@/rpc/procedures';

export const createTagAction = protectedOs
  .input(tagCreateSchema)
  .output(tagSchema)
  .errors({
    INTERNAL_SERVER_ERROR: { message: 'Failed to create tag' },
  })
  .handler(async ({ input }) => {
    const [created] = await db.insert(tag).values(input).returning();

    if (!created) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${input.storeId}/tags`);
    return created;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const updateTagAction = protectedOs
  .input(tagUpdateSchema)
  .output(tagSchema)
  .errors({
    INTERNAL_SERVER_ERROR: { message: 'Failed to update tag' },
  })
  .handler(async ({ input }) => {
    const [updated] = await db
      .update(tag)
      .set(input)
      .where(eq(tag.id, input.id))
      .returning();

    if (!updated) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${input.storeId}/tags`);
    return updated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });

export const deleteTagAction = protectedOs
  .input(z.object({ id: z.string(), storeId: z.string() }))
  .errors({
    INTERNAL_SERVER_ERROR: { message: 'Failed to delete tag' },
  })
  .handler(async ({ input }) => {
    try {
      await db.delete(tag).where(eq(tag.id, input.id));
    } catch (_e) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${input.storeId}/tags`);
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
