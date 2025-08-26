'use server';

import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { db } from '@/db';
import { store } from '@/db/schema';
import {
  storeSchema,
  updateStoreSchema,
} from '@/features/stores/schemas/store-schema';
import { protectedOs } from '../procedures';

export const updateStoreAction = protectedOs
  .input(updateStoreSchema)
  .output(storeSchema)
  .handler(async ({ input }) => {
    const [storeUpdated] = await db
      .update(store)
      .set({ ...input })
      .where(eq(store.id, input.id))
      .returning();

    if (!storeUpdated) {
      throw new ORPCError('INTERNAL_SERVER_ERROR');
    }

    revalidatePath(`/d/${storeUpdated.id}/update-store`);
    return storeUpdated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
