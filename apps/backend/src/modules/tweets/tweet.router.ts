import { z } from 'zod';
import { router, procedure, noAuthProcedure } from '../../server/trpc';
import {
    createTweetSchema,
    likeTweetSchema,
    retweetSchema,
    followUserSchema,
} from './tweet.dtos';
import {
    createTweet,
    getTweets,
    getUserTweets,
    likeTweet,
    retweetTweet,
    followUser,
    getUserProfile,
} from './tweet.service';

export const tweetRouter = router({
    create: procedure
        .input(createTweetSchema)
        .mutation(async ({ input, ctx }) => {
            return createTweet(input, ctx.user.id, ctx);
        }),

    getAll: noAuthProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.user?.id;
            return getTweets(ctx, userId);
        }),

    getUserTweets: noAuthProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ input, ctx }) => {
            const currentUserId = ctx.user?.id;
            return getUserTweets(input.username, ctx, currentUserId);
        }),

    like: procedure
        .input(likeTweetSchema)
        .mutation(async ({ input, ctx }) => {
            return likeTweet(input, ctx.user.id, ctx);
        }),

    retweet: procedure
        .input(retweetSchema)
        .mutation(async ({ input, ctx }) => {
            return retweetTweet(input, ctx.user.id, ctx);
        }),

    follow: procedure
        .input(followUserSchema)
        .mutation(async ({ input, ctx }) => {
            return followUser(input, ctx.user.id, ctx);
        }),

    getUserProfile: noAuthProcedure
        .input(z.object({ username: z.string() }))
        .query(async ({ input, ctx }) => {
            const currentUserId = ctx.user?.id;
            return getUserProfile(input.username, ctx, currentUserId);
        }),
});
