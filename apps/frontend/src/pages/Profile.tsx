import {
    Box,
    Heading,
    VStack,
    Spinner,
    Text,
    Flex,
    Avatar,
    Button,
    HStack,
    Divider,
} from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '@utils/trpc';
import Tweet from '../components/Tweet/Tweet';
import { toast } from 'react-toastify';

const Profile = () => {
    const { username } = useParams<{ username: string }>();

    const {
        data: profile,
        isLoading: profileLoading,
        error: profileError,
        refetch: refetchProfile,
    } = trpc.tweets.getUserProfile.useQuery(
        { username: username! },
        { enabled: !!username }
    );

    const {
        data: tweets,
        isLoading: tweetsLoading,
        error: tweetsError,
        refetch: refetchTweets,
    } = trpc.tweets.getUserTweets.useQuery(
        { username: username! },
        { enabled: !!username }
    );

    const followMutation = trpc.tweets.follow.useMutation({
        onSuccess: () => {
            refetchProfile();
            toast.success(profile?.isFollowing ? 'Unfollowed!' : 'Following!');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleFollow = () => {
        if (profile) {
            followMutation.mutate({ userId: profile.id });
        }
    };

    if (profileLoading || tweetsLoading) {
        return (
            <Box display="flex" justifyContent="center" p={8}>
                <Spinner size="lg" />
            </Box>
        );
    }

    if (profileError || tweetsError) {
        return (
            <Box p={8}>
                <Text color="red.500">
                    Error loading profile: {profileError?.message || tweetsError?.message}
                </Text>
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box p={8}>
                <Text>User not found</Text>
            </Box>
        );
    }

    return (
        <Box maxW="600px" mx="auto" p={4}>
            <Box mb={6}>
                <Flex align="center" justify="space-between" mb={4}>
                    <Flex align="center">
                        <Avatar
                            size="xl"
                            src={profile.avatar}
                            name={profile.displayName}
                            mr={4}
                        />
                        <Box>
                            <Heading size="lg">{profile.displayName}</Heading>
                            <Text color="gray.500">@{profile.username}</Text>
                        </Box>
                    </Flex>
                    {!profile.isFollowing && (
                        <Button
                            colorScheme={profile.isFollowing ? 'gray' : 'blue'}
                            onClick={handleFollow}
                            isLoading={followMutation.isLoading}
                        >
                            {profile.isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                    )}
                </Flex>

                {profile.bio && (
                    <Text mb={4}>{profile.bio}</Text>
                )}

                <HStack spacing={6} mb={4}>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {profile._count.following}
                        </Text>{' '}
                        Following
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {profile._count.followers}
                        </Text>{' '}
                        Followers
                    </Text>
                    <Text>
                        <Text as="span" fontWeight="bold">
                            {profile._count.tweets}
                        </Text>{' '}
                        Tweets
                    </Text>
                </HStack>

                <Text fontSize="sm" color="gray.500">
                    Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>
            </Box>

            <Divider mb={6} />

            <Heading size="md" mb={4}>
                Tweets
            </Heading>

            <VStack spacing={0} align="stretch">
                {tweets && tweets.length > 0 ? (
                    tweets.map((tweet) => (
                        <Tweet
                            key={tweet.id}
                            tweet={tweet}
                            onUpdate={() => {
                                refetchTweets();
                                refetchProfile();
                            }}
                        />
                    ))
                ) : (
                    <Text textAlign="center" color="gray.500" py={8}>
                        No tweets yet.
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default Profile;
