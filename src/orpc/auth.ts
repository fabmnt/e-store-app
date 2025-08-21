'use server';

import { ORPCError, os } from '@orpc/server';
import { headers } from 'next/headers';
import * as z from 'zod';
import { auth } from '@/lib/auth';

export const signIn = os
  .input(
    z.object({
      email: z.email(),
      password: z.string(),
    })
  )
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
  .input(
    z.object({
      name: z.string(),
      email: z.email(),
      password: z.string(),
    })
  )
  .handler(async ({ input }) => {
    try {
      await auth.api.signUpEmail({
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    } catch (_error) {
      throw new ORPCError('BAD_REQUEST');
    }
  })
  .actionable();
