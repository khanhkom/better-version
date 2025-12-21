/**
 * HabitRow Component
 * Displays a habit row with icon, name, weekly progress, and streak counter
 */

import type { Habit } from '@/types/game';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { WeeklyProgressGrid } from './WeeklyProgressGrid';

type HabitRowProps = {
    readonly habit: Habit;
};

export function HabitRow({ habit }: HabitRowProps) {
    return (
        <Card
            backgroundColor="farmCardBgLight"
            borderColor="farmBorder"
            borderRadius="m"
            borderWidth={2}
            mb="s"
            padding="m"
        >
            <Box alignItems="center" flexDirection="row" gap="m">
                {/* Icon */}
                <Box
                    alignItems="center"
                    justifyContent="center"
                    width={40}
                >
                    <Emoji size={28} symbol={habit.icon ?? '📋'} />
                </Box>

                {/* Habit Name */}
                <Box flex={1}>
                    <Text fontSize={14} fontWeight="700">
                        {habit.title}
                    </Text>
                </Box>

                {/* Weekly Progress */}
                <Box alignItems="center" justifyContent="center">
                    <WeeklyProgressGrid completionDates={habit.completionDates} />
                </Box>

                {/* Streak Counter */}
                <Box
                    alignItems="center"
                    backgroundColor="highlightYellow"
                    borderRadius="s"
                    flexDirection="row"
                    gap="xs"
                    justifyContent="center"
                    paddingHorizontal="s"
                    paddingVertical="xs"
                >
                    <Emoji size={16} symbol="🔥" />
                    <Text color="farmBorderDark" fontSize={12} fontWeight="700">
                        {habit.streak}
                    </Text>
                </Box>
            </Box>
        </Card>
    );
}

