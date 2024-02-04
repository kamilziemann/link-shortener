import { z } from 'zod';

export const emailValidation = z
  .string()
  .min(1, { message: 'This field has to be filled.' })
  .email('This is not a valid email.');

export const passwordValidation = z.string().min(1, { message: 'This field has to be filled.' });
