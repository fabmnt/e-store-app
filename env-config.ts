import { loadEnvConfig } from '@next/env';
import { z } from 'zod/v4';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

export const { DATABASE_URL } = envSchema.parse(process.env);
