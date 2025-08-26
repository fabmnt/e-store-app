import { ORPCError } from '@orpc/client';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '@/db';
import { store } from '@/db/schema';
import {
  createStoreSchema,
  storeSchema,
  storeWithCategoriesSchema,
  updateStoreSchema,
} from '@/features/stores/schemas/store-schema';
import { protectedOs, publicOs } from './procedures';

export const storeRouter = {
  create: protectedOs
    .errors({
      BAD_REQUEST: {
        message: 'Wrong input',
      },
      INTERNAL_SERVER_ERROR: {
        message: 'Failed to create store',
      },
    })
    .input(createStoreSchema)
    .output(storeSchema)
    .handler(async ({ input }) => {
      const [newStore] = await db.insert(store).values(input).returning();
      if (!newStore) {
        throw new ORPCError('BAD_REQUEST');
      }

      return newStore;
    }),
  getAll: protectedOs.output(storeSchema.array()).handler(async () => {
    const stores = await db.query.store.findMany();
    return stores;
  }),
  getById: protectedOs
    .errors({
      NOT_FOUND: {
        message: 'Store not found',
      },
    })
    .input(z.object({ id: z.string() }))
    .output(storeSchema)
    .handler(async ({ input }) => {
      const storeFound = await db.query.store.findFirst({
        where: eq(store.id, input.id),
      });

      if (!storeFound) {
        throw new ORPCError('NOT_FOUND');
      }

      return storeFound;
    }),
  getBySlug: publicOs
    .errors({
      NOT_FOUND: {
        message: 'Store not found',
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(storeWithCategoriesSchema)
    .handler(async ({ input }) => {
      const storeFound = await db.query.store.findFirst({
        where: eq(store.slug, input.slug),
        with: {
          categories: true,
        },
      });

      if (!storeFound) {
        throw new ORPCError('NOT_FOUND');
      }

      return storeFound;
    }),
  update: protectedOs
    .errors({
      NOT_FOUND: {
        message: 'Store not found',
      },
    })
    .input(updateStoreSchema)
    .output(storeSchema)
    .handler(async ({ input }) => {
      const [updatedStore] = await db
        .update(store)
        .set(input)
        .where(eq(store.id, input.id))
        .returning();

      if (!updatedStore) {
        throw new ORPCError('NOT_FOUND');
      }

      return updatedStore;
    }),
};
