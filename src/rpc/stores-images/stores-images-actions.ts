'use server';

import { ORPCError } from '@orpc/server';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/db';
import { storeImage } from '@/db/schema';
import {
  storeImageSchema,
  storeImageTypeSchema,
} from '@/features/stores-images/schemas/store-image-schema';
import { protectedOs } from '../procedures';

export const updateStoreImageType = protectedOs
  .input(
    z.object({
      id: z.string(),
      type: storeImageTypeSchema,
      storeId: z.uuid(),
    })
  )
  .output(storeImageSchema)
  .errors({
    NOT_FOUND: {
      message: 'Store image not found',
    },
  })
  .handler(async ({ input }) => {
    const { id, type, storeId } = input;

    const currentTypeImage = await db.query.storeImage.findFirst({
      where: and(eq(storeImage.type, type), eq(storeImage.storeId, storeId)),
    });

    if (currentTypeImage) {
      await db
        .update(storeImage)
        .set({ type: null })
        .where(eq(storeImage.id, currentTypeImage.id));
    }

    const [storeImageUpdated] = await db
      .update(storeImage)
      .set({ type })
      .where(eq(storeImage.id, id))
      .returning();

    if (!storeImageUpdated) {
      throw new ORPCError('NOT_FOUND');
    }

    revalidatePath(`/d/${storeImageUpdated.storeId}/update-store`);
    return storeImageUpdated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
