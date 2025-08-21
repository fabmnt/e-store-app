import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { DATABASE_URL } from '../../env-config';
// biome-ignore lint/performance/noNamespaceImport: It's required
import * as schema from './schema';

const sql = neon(DATABASE_URL);

export const db = drizzle({ client: sql, schema });
