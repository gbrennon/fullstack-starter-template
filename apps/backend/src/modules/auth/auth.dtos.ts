import { z } from 'zod';

export const userCredentialsSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8),
});

export const signUpSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z
    .string({
      required_error: 'Display name is required',
    })
    .min(1)
    .max(100),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export type SignInDto = z.TypeOf<typeof userCredentialsSchema>;
export type SignUpDto = z.TypeOf<typeof signUpSchema>;
export type UpdateProfileDto = z.TypeOf<typeof updateProfileSchema>;
