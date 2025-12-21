/**
 * FarmHeader Component
 * Display player stats and level progress
 */

import { usePlayerStats } from '@/hooks';

import Box from '@/components/atoms/Box';
import ProgressBar from '@/components/atoms/ProgressBar';
import Text from '@/components/atoms/Text';
import StatCard from '@/components/molecules/StatCard';

import { XP_PER_LEVEL } from '@/constants/game';

export function FarmHeader() {
    const { diamonds, level, money, xp } = usePlayerStats();

    // Calculate XP progress for current level
    const xpInCurrentLevel = xp % XP_PER_LEVEL;

    return (
        <Box backgroundColor="farmGradientStart" gap="s" padding="m">
            {/* Stats Row */}
            <Box flexDirection="row" gap="s">
                <Box flex={1}>
                    <StatCard
                        icon="💰"
                        label="Money"
                        value={money.toString()}
                        variant="gold"
                    />
                </Box>
                <Box flex={1}>
                    <StatCard
                        icon="💎"
                        label="Diamonds"
                        value={diamonds.toString()}
                        variant="blue"
                    />
                </Box>
            </Box>

            {/* Level Progress */}
            <Box>
                <Text color="farmCardBgLight" fontSize={14} fontWeight="600" mb="xs">
                    Level {level}
                </Text>
                <ProgressBar
                    current={xpInCurrentLevel}
                    max={XP_PER_LEVEL}
                    variant="yellow"
                />
            </Box>
        </Box>
    );
}

