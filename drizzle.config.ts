// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default {
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql', // This line was missing
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
} satisfies Config;