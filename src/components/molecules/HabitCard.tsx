/**
 * HabitCard Component
 * Displays a habit with completion status and streak
 */

import React from 'react';
import { Pressable } from 'react-native';

import type { Habit } from '@/types/game';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import { Emoji } from '@/components/atoms/Emoji';

type HabitCardProps = {
  readonly habit: Habit;
  readonly onDelete: (id: string) => void;
  readonly onToggle: (id: string) => void;
};

export function HabitCard({ habit, onDelete, onToggle }: HabitCardProps) {
  const isCompleted = habit.completedToday;
  const frequencyLabel = habit.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần';

  return (
    <Card
      backgroundColor={isCompleted ? 'success' : 'farmCardBgLight'}
      borderColor={isCompleted ? 'farmBorder' : 'farmBorderDark'}
      borderRadius="m"
      borderWidth={2}
      mb="s"
      opacity={isCompleted ? 0.7 : 1}
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
            {isCompleted && <Emoji size={24} symbol="✓" />}
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
            {habit.name}
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
        <Button
          backgroundColor="danger"
          borderRadius="s"
          onPress={() => { onDelete(habit.id); }}
          padding="xs"
        >
          <Text fontSize={14}>🗑️</Text>
        </Button>
      </Box>
    </Card>
  );
}
