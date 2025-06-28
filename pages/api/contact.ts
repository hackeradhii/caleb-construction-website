// /pages/api/contact.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // Import our Drizzle client
import { contactSubmissions } from '@/lib/db/schema'; // Import the specific table schema
import { z, ZodError } from 'zod';

// Define the shape of the expected input data for validation.
const submissionSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

type ResponseData = {
  message: string;
  errors?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // We only accept POST requests to this endpoint.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // 1. Validate the incoming request body against our schema.
    const body = submissionSchema.parse(req.body);

    // 2. If validation is successful, insert the data into the database.
    await db.insert(contactSubmissions).values({
      fullName: body.fullName,
      email: body.email,
      message: body.message,
    });

    // 3. Send a success response back to the frontend.
    return res.status(200).json({ message: 'Thank you for your message! We will be in touch soon.' });

  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Invalid form submission.',
        errors: error.flatten().fieldErrors,
      });
    }

    // Handle other potential errors (e.g., database connection issues)
    console.error('Contact form submission error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
}
