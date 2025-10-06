import { authRouter } from '../modules/auth/auth.router';
import { tweetRouter } from '../modules/tweets/tweet.router';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  tweets: tweetRouter,
});

export type AppRouter = typeof appRouter;
