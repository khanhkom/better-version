/**
 * TaskCard Component
 * Displays a task card with icon, difficulty, rewards, and Gieo button
 */

import type { Habit } from '@/types/game';

import { useState } from 'react';
import { Alert, Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

type TaskCardProps = {
    readonly habit: Habit;
    readonly isCompleted?: boolean;
    readonly onDelete?: (habitId: string) => void;
    readonly onEdit?: (habitId: string) => void;
    readonly onPlant: (habitId: string) => void;
};

const DIFFICULTY_LABELS: Record<string, string> = {
    easy: 'DỄ',
    hard: 'KHÓ',
    medium: 'VỪA',
};

const DIFFICULTY_COLORS: Record<string, keyof typeof import('@/theme/restyle').default.colors> = {
    easy: 'success',
    hard: 'danger',
    medium: 'warning',
};

const PRESSED_OPACITY = 0.7;

export function TaskCard({ habit, isCompleted = false, onDelete, onEdit, onPlant }: TaskCardProps) {
    const difficultyLabel = DIFFICULTY_LABELS[habit.difficulty] ?? 'VỪA';
    const difficultyColor = DIFFICULTY_COLORS[habit.difficulty] ?? 'warning';
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
        if (onEdit) {
            onEdit(habit.id);
        }
    };

    const handleLongPress = () => {
        if (onDelete) {
            Alert.alert(
                'Xóa nhiệm vụ',
                `Bạn có chắc muốn xóa "${habit.title}"?`,
                [
                    {
                        style: 'cancel',
                        text: 'Hủy',
                    },
                    {
                        onPress: () => { onDelete(habit.id); },
                        style: 'destructive',
                        text: 'Xóa',
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const buttonColor = isCompleted ? 'farmBorderDark' : 'success';
    const buttonText = isCompleted ? 'Xong' : 'Gieo';

    return (
        <Pressable
            onLongPress={handleLongPress}
            onPress={handlePress}
            onPressIn={() => { setIsPressed(true); }}
            onPressOut={() => { setIsPressed(false); }}
        >
            <Box
                backgroundColor="farmCardBgLight"
                borderColor="white"
                borderRadius="m"
                borderWidth={2}
                elevation={2}
                mb="m"
                paddingHorizontal="l"
                paddingVertical="m"
                shadowColor="black"
                shadowOffset={{ height: 2, width: 0 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 12,
                    opacity: isPressed ? PRESSED_OPACITY : 1,
                }}
            >
                {/* Icon with circular background */}
                <Box
                    alignItems="center"
                    backgroundColor="white"
                    borderRadius="s"
                    height={48}
                    justifyContent="center"
                    width={48}
                >
                    <Emoji size={22} symbol={habit.icon ?? '📋'} />
                </Box>

                {/* Content */}
                <Box flex={1}>
                    <Text color="farmBorderDark" fontSize={15} fontWeight="700" marginBottom="xs">
                        {habit.title}
                    </Text>
                    <Box flexDirection="row" gap="s" style={{ alignItems: 'center' }}>
                        <Text color={difficultyColor} fontSize={11} fontWeight="700">
                            {difficultyLabel}
                        </Text>
                        <Text color="warning" fontSize={11} fontWeight="500">
                            +{habit.moneyReward} Xu
                        </Text>
                        <Text color="primary" fontSize={11} fontWeight="500">
                            +{habit.xpReward} XP
                        </Text>
                    </Box>
                </Box>

                {/* Gieo/Xong Button */}
                <Button
                    backgroundColor={buttonColor}
                    borderColor="white"
                    borderRadius="m"
                    borderWidth={2}
                    disabled={isCompleted}
                    onPress={() => { onPlant(habit.id); }}
                    paddingHorizontal="l"
                    paddingVertical="s"
                    textColor="white"
                    title={buttonText}
                />
            </Box>
        </Pressable>
    );
}

