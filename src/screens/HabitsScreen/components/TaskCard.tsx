/**
 * TaskCard Component
 * Displays a task card with icon, difficulty, rewards, and Gieo button
 * Redesigned with pastel colors, high border radius, and gamification elements
 */

import type { Habit } from '@/types/game';

import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
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
    easy: 'habitProgressFill',
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

    return (
        <Box mb="m">
            {/* Main Card */}
            <Pressable
                onLongPress={handleLongPress}
                onPress={handlePress}
                onPressIn={() => { setIsPressed(true); }}
                onPressOut={() => { setIsPressed(false); }}
            >
                <Box
                    backgroundColor="habitBgWhite"
                    borderColor="habitBorderLight"
                    borderRadius="xl"
                    borderWidth={1}
                    elevation={1}
                    paddingHorizontal="m"
                    paddingVertical="m"
                    shadowColor="habitTextMuted"
                    shadowOffset={{ height: 1, width: 0 }}
                    shadowOpacity={0.05}
                    shadowRadius={4}
                    style={{
                        opacity: isPressed ? PRESSED_OPACITY : 1,
                    }}
                >
                    <Box flexDirection="row" gap="s" style={{ alignItems: 'center' }}>
                        {/* Icon */}
                        <Box
                            alignItems="center"
                            backgroundColor="habitBgPastelBlue"
                            borderRadius="xl"
                            height={40}
                            justifyContent="center"
                            width={40}
                        >
                            <Emoji size={20} symbol={habit.icon ?? '📋'} />
                        </Box>

                        {/* Content */}
                        <Box flex={1} gap="xs">
                            <Text color="habitTextDark" fontSize={15} fontWeight="700">
                                {habit.title}
                            </Text>

                            {/* Tags row */}
                            <Box flexDirection="row" gap="xs" style={{ alignItems: 'center' }}>
                                <Box
                                    backgroundColor="habitBgPastelGreen"
                                    borderRadius="full"
                                    paddingHorizontal="s"
                                    paddingVertical="xxs"
                                >
                                    <Text color={difficultyColor} fontSize={10} fontWeight="700">
                                        {difficultyLabel}
                                    </Text>
                                </Box>

                                <Box flexDirection="row" gap="xxs" style={{ alignItems: 'center' }}>
                                    <Emoji size={12} symbol="💰" />
                                    <Text color="habitTextMuted" fontSize={11} fontWeight="600">
                                        +{habit.moneyReward}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>

                        {/* CTA Button */}
                        {isCompleted ? (
                            <Box
                                alignItems="center"
                                backgroundColor="habitProgressFill"
                                borderRadius="full"
                                height={36}
                                justifyContent="center"
                                paddingHorizontal="m"
                            >
                                <Check color="white" size={16} />
                            </Box>
                        ) : (
                            <TouchableOpacity onPress={() => { onPlant(habit.id); }}>
                                <Box
                                    alignItems="center"
                                    backgroundColor="breakGreen"
                                    borderRadius="full"
                                    height={36}
                                    justifyContent="center"
                                    paddingHorizontal="m"
                                >
                                    <Text color="white" fontSize={13} fontWeight="700">
                                        Claim
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        )}
                    </Box>
                </Box>
            </Pressable>
        </Box>
    );
}

