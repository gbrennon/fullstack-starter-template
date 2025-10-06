import { TRPCError } from '@trpc/server';
import { CreateTweetDto, LikeTweetDto, RetweetDto, FollowUserDto } from './tweet.dtos';
import { Context } from '../../server/context';

export const createTweet = async (
    input: CreateTweetDto,
    userId: number,
    ctx: Context
) => {
    const tweet = await ctx.prisma.tweet.create({
        data: {
            content: input.content,
            authorId: userId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                },
            },
            likes: true,
            retweets: true,
            _count: {
                select: {
                    likes: true,
                    retweets: true,
                },
            },
        },
    });

    return tweet;
};

export const getTweets = async (ctx: Context, userId?: number) => {
    const tweets = await ctx.prisma.tweet.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                },
            },
            likes: userId ? {
                where: {
                    userId: userId,
                },
            } : false,
            retweets: userId ? {
                where: {
                    userId: userId,
                },
            } : false,
            _count: {
                select: {
                    likes: true,
                    retweets: true,
                },
            },
        },
    });

    return tweets.map(tweet => ({
        ...tweet,
        isLiked: userId ? tweet.likes.length > 0 : false,
        isRetweeted: userId ? tweet.retweets.length > 0 : false,
        likes: undefined,
        retweets: undefined,
    }));
};

export const getUserTweets = async (username: string, ctx: Context, currentUserId?: number) => {
    const user = await ctx.prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        throw new TRPCError({
            message: 'User not found',
            code: 'NOT_FOUND',
        });
    }

    const tweets = await ctx.prisma.tweet.findMany({
        where: {
            authorId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                },
            },
            likes: currentUserId ? {
                where: {
                    userId: currentUserId,
                },
            } : false,
            retweets: currentUserId ? {
                where: {
                    userId: currentUserId,
                },
            } : false,
            _count: {
                select: {
                    likes: true,
                    retweets: true,
                },
            },
        },
    });

    return tweets.map(tweet => ({
        ...tweet,
        isLiked: currentUserId ? tweet.likes.length > 0 : false,
        isRetweeted: currentUserId ? tweet.retweets.length > 0 : false,
        likes: undefined,
        retweets: undefined,
    }));
};

export const likeTweet = async (
    input: LikeTweetDto,
    userId: number,
    ctx: Context
) => {
    const existingLike = await ctx.prisma.like.findUnique({
        where: {
            userId_tweetId: {
                userId,
                tweetId: input.tweetId,
            },
        },
    });

    if (existingLike) {
        // Unlike
        await ctx.prisma.like.delete({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId: input.tweetId,
                },
            },
        });
        return { liked: false };
    } else {
        // Like
        await ctx.prisma.like.create({
            data: {
                userId,
                tweetId: input.tweetId,
            },
        });
        return { liked: true };
    }
};

export const retweetTweet = async (
    input: RetweetDto,
    userId: number,
    ctx: Context
) => {
    const existingRetweet = await ctx.prisma.retweet.findUnique({
        where: {
            userId_tweetId: {
                userId,
                tweetId: input.tweetId,
            },
        },
    });

    if (existingRetweet) {
        // Un-retweet
        await ctx.prisma.retweet.delete({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId: input.tweetId,
                },
            },
        });
        return { retweeted: false };
    } else {
        // Retweet
        await ctx.prisma.retweet.create({
            data: {
                userId,
                tweetId: input.tweetId,
            },
        });
        return { retweeted: true };
    }
};

export const followUser = async (
    input: FollowUserDto,
    currentUserId: number,
    ctx: Context
) => {
    if (input.userId === currentUserId) {
        throw new TRPCError({
            message: 'You cannot follow yourself',
            code: 'BAD_REQUEST',
        });
    }

    const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: input.userId,
            },
        },
    });

    if (existingFollow) {
        // Unfollow
        await ctx.prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: input.userId,
                },
            },
        });
        return { following: false };
    } else {
        // Follow
        await ctx.prisma.follow.create({
            data: {
                followerId: currentUserId,
                followingId: input.userId,
            },
        });
        return { following: true };
    }
};

export const getUserProfile = async (username: string, ctx: Context, currentUserId?: number) => {
    const user = await ctx.prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatar: true,
            createdAt: true,
            _count: {
                select: {
                    tweets: true,
                    followers: true,
                    following: true,
                },
            },
        },
    });

    if (!user) {
        throw new TRPCError({
            message: 'User not found',
            code: 'NOT_FOUND',
        });
    }

    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
        const follow = await ctx.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: user.id,
                },
            },
        });
        isFollowing = !!follow;
    }

    return {
        ...user,
        isFollowing,
    };
};
