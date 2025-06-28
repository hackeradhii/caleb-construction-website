// /lib/db/schema.ts

import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

// --- Existing Tables (Regions, Services, Projects, etc.) ---
// ... (schema from the initial plan would be here)

/**
 * NEW: Table for Contact Form Submissions
 * This table will store messages sent through the website's contact form.
 */
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  message: text('message').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});
