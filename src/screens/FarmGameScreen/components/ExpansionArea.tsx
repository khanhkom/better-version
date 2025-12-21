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
                borderRadius="s"
                borderStyle="dashed"
                borderWidth={1.5}
                height={46}
                justifyContent="center"
                width={46}
            >
                <Text color='textPrimary' fontSize={16} fontWeight="700">
                    +
                </Text>
                <Text color="white" fontSize={7} fontWeight="600" mt="xxs">
                    {EXPANSION_COST}
                </Text>
            </Box>
        </Pressable>
    );
}

