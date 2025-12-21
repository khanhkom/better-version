/**
 * CloseButton Component
 * Red X button for closing the screen
 */

import { TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

type CloseButtonProps = {
    readonly onPress: () => void;
};

export function CloseButton({ onPress }: CloseButtonProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Box
                alignItems="center"
                backgroundColor="danger"
                borderRadius="s"
                height={32}
                justifyContent="center"
                width={32}
            >
                <Text color="white" fontSize={16} fontWeight="700">
                    ✕
                </Text>
            </Box>
        </TouchableOpacity>
    );
}

