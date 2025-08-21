import * as z from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    ),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
