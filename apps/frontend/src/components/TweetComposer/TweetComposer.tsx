import {
    Box,
    Textarea,
    Button,
    Flex,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
import { toast } from 'react-toastify';

interface TweetComposerProps {
    onTweetCreated?: () => void;
}

const TweetComposer = ({ onTweetCreated }: TweetComposerProps) => {
    const [content, setContent] = useState('');
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const createTweetMutation = trpc.tweets.create.useMutation({
        onSuccess: () => {
            setContent('');
            toast.success('Tweet posted!');
            onTweetCreated?.();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = () => {
        if (content.trim()) {
            createTweetMutation.mutate({ content: content.trim() });
        }
    };

    const remainingChars = 280 - content.length;
    const isOverLimit = remainingChars < 0;

    return (
        <Box
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            mb={6}
        >
            <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                resize="none"
                minHeight="120px"
                border="none"
                _focus={{ boxShadow: 'none' }}
                fontSize="lg"
            />
            <Flex justify="space-between" align="center" mt={3}>
                <Text
                    fontSize="sm"
                    color={isOverLimit ? 'red.500' : 'gray.500'}
                >
                    {remainingChars}
                </Text>
                <Button
                    colorScheme="blue"
                    size="md"
                    onClick={handleSubmit}
                    isDisabled={!content.trim() || isOverLimit}
                    isLoading={createTweetMutation.isLoading}
                    loadingText="Posting..."
                >
                    Tweet
                </Button>
            </Flex>
        </Box>
    );
};

export default TweetComposer;
