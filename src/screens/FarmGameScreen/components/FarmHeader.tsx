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
            {/* Level and Progress Row */}
            <Box alignItems="center" flexDirection="row" gap="m">
                {/* Level Badge */}
                <Box
                    alignItems="center"
                    backgroundColor="primary"
                    borderRadius="m"
                    justifyContent="center"
                    paddingHorizontal="m"
                    paddingVertical="s"
                >
                    <Text color="white" fontSize={14} fontWeight="700">
                        Cấp {level}
                    </Text>
                </Box>

                {/* Progress Bar */}
                <Box flex={1}>
                    <ProgressBar
                        current={xpInCurrentLevel}
                        label={`${xpInCurrentLevel} / ${XP_PER_LEVEL} XP`}
                        max={XP_PER_LEVEL}
                        variant="yellow"
                    />
                </Box>
            </Box>

            {/* Stats Row */}
            <Box flexDirection="row" gap="s">
                <Box flex={1}>
                    <StatCard
                        icon="💰"
                        value={money.toString()}
                        variant="gold"
                    />
                </Box>
                <Box flex={1}>
                    <StatCard
                        icon="💎"
                        value={diamonds.toString()}
                        variant="blue"
                    />
                </Box>
            </Box>
        </Box>
    );
}

