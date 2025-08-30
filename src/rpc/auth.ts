'use server';

import { ORPCError, os } from '@orpc/server';
import { headers } from 'next/headers';
import { signInSchema } from '@/features/signin/schemas/signin-schema';
import { signUpSchema } from '@/features/signup/schemas/signup-schema';
import { auth } from '@/lib/auth';

export const signIn = os
  .input(signInSchema)
  .handler(async ({ input }) => {
    try {
      await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      });
    } catch (_error) {
      throw new ORPCError('BAD_REQUEST');
    }
  })
  .actionable();

export const signOut = os
  .handler(async () => {
    await auth.api.signOut({
      headers: await headers(),
    });
  })
  .actionable();

export const signUp = os
  .input(signUpSchema)
  .handler(() => {
    throw new ORPCError('BAD_REQUEST');
  })
  .actionable();
