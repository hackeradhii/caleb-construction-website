// /lib/db/index.ts

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create the database client instance.
// The connection string is securely pulled from environment variables.
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle with the client and schema.
// This `db` object is what we'll use in our API routes to query the database.
export const db = drizzle(sql, { schema });
