import { os } from '@orpc/server';
import * as z from 'zod';

const ping = os.handler(async () => 'ping');
const pong = os.handler(async () => 'pong');
const hello = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => `hello ${input.name}`)
  .callable();

export const router = {
  ping,
  pong,
  hello,
  nested: { ping, pong },
};
