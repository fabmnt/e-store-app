import * as z from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const signInSchema = z.object({
  email: z.email('Invalid email adress'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    ),
});

export type SignInSchema = z.infer<typeof signInSchema>;
