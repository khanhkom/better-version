/**
 * ExpansionArea Component
 * Area for expanding farm plots
 */

import { Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { PLOT_BASE_COST } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

type ExpansionAreaProps = {
    readonly onPress: () => void;
};

export function ExpansionArea({ onPress }: ExpansionAreaProps) {
    const plots = useGameStore((state) => state.plots);
    const money = useGameStore((state) => state.money);

    // Calculate dynamic cost
    const expansionCost = (plots.length + 1) * PLOT_BASE_COST;
    const canAfford = money >= expansionCost;

    return (
        <Pressable disabled={!canAfford} onPress={onPress}>
            <Box
                alignItems="center"
                backgroundColor={canAfford ? 'farmBoard' : 'farmBorder'}
                borderColor={canAfford ? 'white' : 'borderDefault'}
                borderRadius="s"
                borderStyle="dashed"
                borderWidth={1.5}
                height={46}
                justifyContent="center"
                opacity={canAfford ? 1 : 0.5}
                width={46}
            >
                <Text color='white' fontSize={16} fontWeight="700">
                    +
                </Text>
                <Box alignItems="center" flexDirection="row" gap="xxs" mt="xxs">
                    <Emoji size={8} symbol="💰" />
                    <Text color="gold" fontSize={7} fontWeight="700">
                        {expansionCost}
                    </Text>
                </Box>
            </Box>
        </Pressable>
    );
}

