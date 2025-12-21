/**
 * HabitCard Component
 * Displays a habit with completion status and streak
 */

import type { Habit } from '@/types/game';

import { Pressable, TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

const COMPLETED_OPACITY = 0.7;

type HabitCardProps = {
  readonly habit: Habit;
  readonly onDelete: (id: string) => void;
  readonly onToggle: (id: string) => void;
};

export function HabitCard({ habit, onDelete, onToggle }: HabitCardProps) {
  // Check if habit is completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  const isCompleted = habit.completionDates.includes(todayTimestamp);

  const frequencyLabel = habit.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần';

  return (
    <Card
      backgroundColor={isCompleted ? 'success' : 'farmCardBgLight'}
      borderColor={isCompleted ? 'farmBorder' : 'farmBorderDark'}
      borderRadius="m"
      borderWidth={2}
      mb="s"
      opacity={isCompleted ? COMPLETED_OPACITY : 1}
      padding="m"
    >
      <Box flexDirection="row" gap="m">
        {/* Checkbox */}
        <Pressable onPress={() => { onToggle(habit.id); }}>
          <Box
            alignItems="center"
            backgroundColor={isCompleted ? 'farmBoard' : 'cardBg'}
            borderColor="farmBorder"
            borderRadius="s"
            borderWidth={2}
            height={40}
            justifyContent="center"
            width={40}
          >
            {isCompleted ? <Emoji size={24} symbol="✓" /> : undefined}
          </Box>
        </Pressable>

        {/* Content */}
        <Box flex={1}>
          <Text
            fontSize={14}
            fontWeight="700"
            mb="xs"
            style={{ textDecorationLine: isCompleted ? 'line-through' : 'none' }}
          >
            {habit.title}
          </Text>
          <Text color="textSecondary" fontSize={11} mb="xs">
            {frequencyLabel} • {habit.xpReward} XP
          </Text>
          <Box flexDirection="row" gap="xs">
            <Text color="highlightOrange" fontSize={11} fontWeight="700">
              🔥 {habit.streak} day streak
            </Text>
          </Box>
        </Box>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => { onDelete(habit.id); }}>
          <Box
            alignItems="center"
            backgroundColor="danger"
            borderRadius="s"
            justifyContent="center"
            padding="xs"
          >
            <Text fontSize={14}>🗑️</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Card>
  );
}
