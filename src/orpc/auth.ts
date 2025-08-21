'use server';

import { ORPCError } from '@orpc/server';
import { headers } from 'next/headers';
import * as z from 'zod';
import { auth } from '@/lib/auth';
import { publicOs } from './procedures';

export const signIn = publicOs
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
  .actionable({ context: { headers: await headers() } });

export const signOut = publicOs
  .handler(async ({ context }) => {
    await auth.api.signOut({
      headers: context.headers,
    });
  })
  .actionable({ context: { headers: await headers() } });

export const signUp = publicOs
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
  .actionable({ context: { headers: await headers() } });
