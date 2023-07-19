import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    author: z.string({ required_error: 'Author name is required' }),
    genre: z.string({ required_error: 'Genre is required' }),
    publicationYear: z.string({
      required_error: 'publication Year is required',
    }),
  }),
});

export const bookValidation = {
  createBookZodSchema,
};
