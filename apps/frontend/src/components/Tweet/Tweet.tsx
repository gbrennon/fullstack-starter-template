import {
    Box,
    Flex,
    Avatar,
    Text,
    IconButton,
    HStack,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { FiHeart, FiMessageCircle, FiRepeat } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { trpc } from '@utils/trpc';
import { toast } from 'react-toastify';

interface TweetProps {
    tweet: {
        id: number;
        content: string;
        createdAt: string;
        author: {
            id: number;
            username: string;
            displayName: string;
            avatar?: string;
        };
        _count: {
            likes: number;
            retweets: number;
        };
        isLiked?: boolean;
        isRetweeted?: boolean;
    };
    onUpdate?: () => void;
}

const Tweet = ({ tweet, onUpdate }: TweetProps) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const likeMutation = trpc.tweets.like.useMutation({
        onSuccess: () => {
            onUpdate?.();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const retweetMutation = trpc.tweets.retweet.useMutation({
        onSuccess: () => {
            onUpdate?.();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleLike = () => {
        likeMutation.mutate({ tweetId: tweet.id });
    };

    const handleRetweet = () => {
        retweetMutation.mutate({ tweetId: tweet.id });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Box
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            mb={4}
        >
            <Flex>
                <Avatar
                    size="md"
                    src={tweet.author.avatar}
                    name={tweet.author.displayName}
                    mr={3}
                />
                <Box flex="1">
                    <Flex align="center" mb={1}>
                        <Link
                            as={RouterLink}
                            to={`/profile/${tweet.author.username}`}
                            fontWeight="bold"
                            mr={2}
                            _hover={{ textDecoration: 'underline' }}
                        >
                            {tweet.author.displayName}
                        </Link>
                        <Text color="gray.500" fontSize="sm">
                            <Link
                                as={RouterLink}
                                to={`/profile/${tweet.author.username}`}
                                color="gray.500"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                @{tweet.author.username}
                            </Link>{' '}
                            · {formatDate(tweet.createdAt)}
                        </Text>
                    </Flex>
                    <Text mb={3}>{tweet.content}</Text>
                    <HStack spacing={6}>
                        <HStack>
                            <IconButton
                                aria-label="Reply"
                                icon={<FiMessageCircle />}
                                variant="ghost"
                                size="sm"
                                colorScheme="blue"
                            />
                            <Text fontSize="sm" color="gray.500">
                                0
                            </Text>
                        </HStack>
                        <HStack>
                            <IconButton
                                aria-label="Retweet"
                                icon={<FiRepeat />}
                                variant="ghost"
                                size="sm"
                                colorScheme="green"
                                color={tweet.isRetweeted ? 'green.500' : 'gray.500'}
                                onClick={handleRetweet}
                                isLoading={retweetMutation.isLoading}
                            />
                            <Text fontSize="sm" color="gray.500">
                                {tweet._count.retweets}
                            </Text>
                        </HStack>
                        <HStack>
                            <IconButton
                                aria-label="Like"
                                icon={<FiHeart />}
                                variant="ghost"
                                size="sm"
                                colorScheme="red"
                                color={tweet.isLiked ? 'red.500' : 'gray.500'}
                                onClick={handleLike}
                                isLoading={likeMutation.isLoading}
                            />
                            <Text fontSize="sm" color="gray.500">
                                {tweet._count.likes}
                            </Text>
                        </HStack>
                    </HStack>
                </Box>
            </Flex>
        </Box>
    );
};

export default Tweet;
