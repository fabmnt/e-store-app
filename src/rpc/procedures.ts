import { ORPCError, os } from '@orpc/server';
import type { headers } from 'next/headers';
import { getSession } from '@/server/session';

export const publicOs = os.$context<{
  headers: Awaited<ReturnType<typeof headers>>;
}>();

export const protectedOs = os
  .$context<{ headers: Awaited<ReturnType<typeof headers>> }>()
  .errors({
    UNAUTHORIZED: {
      message: 'Unauthorized user',
    },
  })
  .use(async ({ context, next }) => {
    const session = await getSession({ headers: context.headers });

    if (!session) {
      throw new ORPCError('UNAUTHORIZED');
    }

    return next({
      context: {
        session,
        headers: context.headers,
      },
    });
  });
