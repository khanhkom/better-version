/**
 * FloatingButton Component
 * Floating action button for adding new habits
 */

import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

type FloatingButtonProps = {
    readonly onPress: () => void;
};

export function FloatingButton({ onPress }: FloatingButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.container}
        >
            <Box
                alignItems="center"
                backgroundColor="habitProgressFill"
                borderRadius="full"
                height={56}
                justifyContent="center"
                width={56}
            >
                <Text color="white" fontSize={24} fontWeight="700">
                    +
                </Text>
            </Box>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        bottom: 24,
        elevation: 8,
        position: 'absolute',
        right: 20,
        shadowColor: '#000',
        shadowOffset: {
            height: 4,
            width: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

