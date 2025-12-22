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
            backgroundColor="statBgWhite"
            borderColor="statBorderLight"
            borderRadius="xxl"
            borderWidth={1}
            elevation={2}
            mb="m"
            padding="l"
            shadowColor="statTextMuted"
            shadowOffset={{ height: 2, width: 0 }}
            shadowOpacity={0.08}
            shadowRadius={8}
        >
            <Box alignItems="center" flexDirection="row" gap="m">
                {/* Icon with pastel background */}
                <Box
                    alignItems="center"
                    backgroundColor="statBgPastelCyan"
                    borderRadius="xxl"
                    height={44}
                    justifyContent="center"
                    width={44}
                >
                    <Emoji size={24} symbol={habit.icon ?? '📋'} />
                </Box>

                {/* Habit Name */}
                <Box flex={1}>
                    <Text color="statTextDark" fontSize={15} fontWeight="700">
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
                    backgroundColor="statStreakBg"
                    borderRadius="full"
                    flexDirection="row"
                    gap="xs"
                    justifyContent="center"
                    paddingHorizontal="m"
                    paddingVertical="xs"
                >
                    <Emoji size={16} symbol="🔥" />
                    <Text color="statStreakText" fontSize={13} fontWeight="700">
                        {habit.streak}
                    </Text>
                </Box>
            </Box>
        </Card>
    );
}

