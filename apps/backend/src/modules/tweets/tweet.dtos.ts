import { z } from 'zod';

export const createTweetSchema = z.object({
    content: z
        .string({
            required_error: 'Tweet content is required',
        })
        .min(1)
        .max(280),
});

export const likeTweetSchema = z.object({
    tweetId: z.number(),
});

export const retweetSchema = z.object({
    tweetId: z.number(),
});

export const followUserSchema = z.object({
    userId: z.number(),
});

export type CreateTweetDto = z.TypeOf<typeof createTweetSchema>;
export type LikeTweetDto = z.TypeOf<typeof likeTweetSchema>;
export type RetweetDto = z.TypeOf<typeof retweetSchema>;
export type FollowUserDto = z.TypeOf<typeof followUserSchema>;
