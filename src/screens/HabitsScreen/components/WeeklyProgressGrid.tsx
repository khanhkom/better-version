/**
 * WeeklyProgressGrid Component
 * Shows 7-day progress grid for a habit
 */

import Box from '@/components/atoms/Box';

type WeeklyProgressGridProps = {
    readonly completionDates: number[];
};

export const DAYS_OF_WEEK = ['T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2']; // Tuesday to Monday
const DAYS_IN_WEEK = 7;
const SUNDAY_OFFSET = -5;
const MONDAY_OFFSET = -6;

// Get dates for the current week (Tuesday to Monday)
const getWeekDates = (): number[] => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate Tuesday of current week
    // If today is Sunday (0), go back 5 days to get Tuesday
    // If today is Monday (1), go back 6 days to get Tuesday
    // Otherwise, go back (dayOfWeek - 2) days
    let daysToTuesday = 0;
    if (dayOfWeek === 0) {
        daysToTuesday = SUNDAY_OFFSET;
    } else if (dayOfWeek === 1) {
        daysToTuesday = MONDAY_OFFSET;
    } else {
        daysToTuesday = 2 - dayOfWeek;
    }

    const tuesday = new Date(today);
    tuesday.setDate(today.getDate() + daysToTuesday);
    tuesday.setHours(0, 0, 0, 0);

    const weekDates: number[] = [];
    for (let index = 0; index < DAYS_IN_WEEK; index++) {
        const date = new Date(tuesday);
        date.setDate(tuesday.getDate() + index);
        weekDates.push(date.getTime());
    }

    return weekDates;
};

export function WeeklyProgressGrid({ completionDates }: WeeklyProgressGridProps) {
    const weekDates = getWeekDates();
    const completedDatesSet = new Set(completionDates);

    return (
        <Box flexDirection="row" gap="xs">
            {weekDates.map((date) => {
                const isCompleted = completedDatesSet.has(date);
                return (
                    <Box
                        backgroundColor={isCompleted ? 'success' : 'cardBg'}
                        borderRadius="xs"
                        height={12}
                        key={date}
                        width={12}
                    />
                );
            })}
        </Box>
    );
}
