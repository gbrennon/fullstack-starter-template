import { Box, Heading, VStack, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { trpc } from '@utils/trpc';
import TweetComposer from '../components/TweetComposer/TweetComposer';
import Tweet from '../components/Tweet/Tweet';

const Home = () => {
  const {
    data: tweets,
    isLoading,
    error,
    refetch,
  } = trpc.tweets.getAll.useQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Text color="red.500">Error loading tweets: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Heading mb={6} size="lg">
        Home
      </Heading>

      <TweetComposer onTweetCreated={() => refetch()} />

      <VStack spacing={0} align="stretch">
        {tweets && tweets.length > 0 ? (
          tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              onUpdate={() => refetch()}
            />
          ))
        ) : (
          <Text textAlign="center" color="gray.500" py={8}>
            No tweets yet. Be the first to post!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
