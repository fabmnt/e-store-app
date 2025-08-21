import { ORPCError, os } from '@orpc/server';
import type { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const publicOs = os.$context<{
  headers: Awaited<ReturnType<typeof headers>>;
}>();

export const protectedOs = os
  .$context<{ headers: Awaited<ReturnType<typeof headers>> }>()
  .use(async ({ context, next }) => {
    const session = await auth.api.getSession({ headers: context.headers });

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
