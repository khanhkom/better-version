/**
 * FinishPlantingButton Component
 * Button to exit continuous planting mode
 */

import { Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

type FinishPlantingButtonProps = {
    readonly onPress: () => void;
    readonly visible: boolean;
};

export function FinishPlantingButton({ onPress, visible }: FinishPlantingButtonProps) {
    if (!visible) {
        return null;
    }

    return (
        <Pressable onPress={onPress}>
            <Box
                alignItems="center"
                backgroundColor="success"
                borderColor="farmBorder"
                borderRadius="m"
                borderWidth={2}
                bottom={20}
                paddingHorizontal="m"
                paddingVertical="s"
                position="absolute"
                left={20}
            >
                <Text color="white" fontSize={12} fontWeight="700">
                    ✓ Xong
                </Text>
            </Box>
        </Pressable>
    );
}
