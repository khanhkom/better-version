/**
 * ExpansionArea Component
 * Area for expanding farm plots
 */

import { Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

const EXPANSION_COST = 500;

type ExpansionAreaProps = {
    readonly onPress: () => void;
};

export function ExpansionArea({ onPress }: ExpansionAreaProps) {
    return (
        <Pressable onPress={onPress}>
            <Box
                alignItems="center"
                borderColor="borderDefault"
                borderRadius="m"
                borderStyle="dashed"
                borderWidth={2}
                height={120}
                justifyContent="center"
                padding="m"
                width={120}
            >
                <Text color="textSecondary" fontSize={24} mb="s">
                    +
                </Text>
                <Box
                    alignItems="center"
                    backgroundColor="cardBg"
                    borderRadius="s"
                    borderWidth={1}
                    paddingHorizontal="s"
                    paddingVertical="xs"
                >
                    <Text color="white" fontSize={10} fontWeight="700">
                        MỞ RỘNG
                    </Text>
                </Box>
                <Box alignItems="center" flexDirection="row" gap="xs" mt="xs">
                    <Text color="white" fontSize={12} fontWeight="700">
                        {EXPANSION_COST}
                    </Text>
                    <Box
                        backgroundColor="textSecondary"
                        borderRadius="full"
                        height={12}
                        width={12}
                    />
                </Box>
            </Box>
        </Pressable>
    );
}

