/**
 * TaskCard Component
 * Displays a task card with icon, difficulty, rewards, and Gieo button
 * Redesigned with pastel colors, high border radius, and gamification elements
 */

import type { Habit } from '@/types/game';

import { Check, Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, TouchableOpacity } from 'react-native';

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
    easy: 'habitProgressFill',
    hard: 'danger',
    medium: 'warning',
};

const PRESSED_OPACITY = 0.7;

// Calculate time remaining until end of day
const useTimeRemaining = () => {
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const diff = endOfDay.getTime() - now.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeRemaining(`${hours}h ${minutes}m`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60_000); // Update every minute

        return () => { clearInterval(interval); };
    }, []);

    return timeRemaining;
};

export function TaskCard({ habit, isCompleted = false, onDelete, onEdit, onPlant }: TaskCardProps) {
    const difficultyLabel = DIFFICULTY_LABELS[habit.difficulty] ?? 'VỪA';
    const difficultyColor = DIFFICULTY_COLORS[habit.difficulty] ?? 'warning';
    const [isPressed, setIsPressed] = useState(false);
    const timeRemaining = useTimeRemaining();

    // Calculate progress (example: based on completion ratio)
    const progress = isCompleted ? 100 : 0;

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
                    borderRadius="xxl"
                    borderWidth={1}
                    elevation={2}
                    paddingHorizontal="l"
                    paddingVertical="l"
                    shadowColor="habitTextMuted"
                    shadowOffset={{ height: 2, width: 0 }}
                    shadowOpacity={0.08}
                    shadowRadius={8}
                    style={{
                        opacity: isPressed ? PRESSED_OPACITY : 1,
                    }}
                >
                    <Box flexDirection="row" gap="m" style={{ alignItems: 'flex-start' }}>
                        {/* Icon with circular gradient background */}
                        <Box
                            alignItems="center"
                            backgroundColor="habitBgPastelBlue"
                            borderRadius="xxl"
                            height={48}
                            justifyContent="center"
                            width={48}
                        >
                            <Emoji size={24} symbol={habit.icon ?? '📋'} />
                        </Box>

                        {/* Content */}
                        <Box flex={1}>
                            <Text color="habitTextDark" fontSize={16} fontWeight="700" marginBottom="xs">
                                {habit.title}
                            </Text>

                            {/* Tags row */}
                            <Box flexDirection="row" gap="xs" mb="m" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                <Box
                                    backgroundColor="habitBgPastelGreen"
                                    borderRadius="full"
                                    paddingHorizontal="m"
                                    paddingVertical="xs"
                                >
                                    <Text color={difficultyColor} fontSize={11} fontWeight="700">
                                        {difficultyLabel}
                                    </Text>
                                </Box>

                                <Box flexDirection="row" gap="xs" style={{ alignItems: 'center' }}>
                                    <Emoji size={14} symbol="💰" />
                                    <Text color="habitTextMuted" fontSize={12} fontWeight="600">
                                        +{habit.moneyReward}
                                    </Text>
                                </Box>
                            </Box>
                            {/* Timer and CTA row */}
                            <Box flexDirection="row" gap="m" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* Timer */}
                                <Box flexDirection="row" gap="xs" style={{ alignItems: 'center' }}>
                                    <Clock color="#78909C" size={14} />
                                    <Text color="habitTextMuted" fontSize={12} fontWeight="500">
                                        {timeRemaining}
                                    </Text>
                                </Box>

                                {/* CTA Button */}
                                {isCompleted ? (
                                    <Box
                                        alignItems="center"
                                        backgroundColor="habitProgressFill"
                                        borderRadius="full"
                                        flexDirection="row"
                                        gap="xs"
                                        justifyContent="center"
                                        paddingHorizontal="l"
                                        paddingVertical="s"
                                    >
                                        <Check color="white" size={16} />
                                        <Text color="white" fontSize={13} fontWeight="700">
                                            Đã xong
                                        </Text>
                                    </Box>
                                ) : (
                                    <TouchableOpacity onPress={() => { onPlant(habit.id); }}>
                                        <Box
                                            alignItems="center"
                                            backgroundColor="breakGreen"
                                            borderRadius="full"
                                            flexDirection="row"
                                            gap="xs"
                                            justifyContent="center"
                                            paddingHorizontal="l"
                                            paddingVertical="s"
                                        >
                                            <Text color="white" fontSize={14} fontWeight="700">
                                                Claim!
                                            </Text>
                                        </Box>
                                    </TouchableOpacity>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Pressable>
        </Box>
    );
}

