import { cache } from 'react';
import { auth } from '@/lib/auth';

export const getSession = cache(async ({ headers }: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers });
  return session;
});
