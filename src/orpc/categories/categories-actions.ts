'use server';

import { ORPCError } from '@orpc/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { category } from '@/db/schema';
import {
  categoryCreateSchema,
  categorySchema,
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

    return categoryCreated;
  })
  .actionable({ context: async () => ({ headers: await headers() }) });
