import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '@/db';
import { store, tag } from '@/db/schema';
import { tagSchema } from '@/features/products/schemas/product-schema';
import { protectedOs, publicOs } from '@/rpc/procedures';

export const tagsQueries = {
  public: {
    getAllByStoreId: publicOs
      .input(z.object({ storeId: z.string() }))
      .output(tagSchema.array())
      .errors({
        NOT_FOUND: { message: 'Store not found' },
      })
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.id, input.storeId),
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        const tagsFound = await db.query.tag.findMany({
          where: eq(tag.storeId, storeFound.id),
        });

        return tagsFound;
      }),
  },
  protected: {
    getAllByStoreId: protectedOs
      .input(z.object({ storeId: z.string() }))
      .output(tagSchema.array())
      .errors({
        NOT_FOUND: { message: 'Store not found' },
      })
      .handler(async ({ input }) => {
        const storeFound = await db.query.store.findFirst({
          where: eq(store.id, input.storeId),
        });

        if (!storeFound) {
          throw new ORPCError('NOT_FOUND');
        }

        const tagsFound = await db.query.tag.findMany({
          where: eq(tag.storeId, storeFound.id),
        });

        return tagsFound;
      }),
  },
};
