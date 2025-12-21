/**
 * AddHabitForm Component
 * Form for adding a new habit with name, icon, reminder time, and difficulty
 */

import type { HabitDifficulty } from '@/types/game';

import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

type AddHabitFormProps = {
    readonly onAdd: (data: {
        difficulty: HabitDifficulty;
        icon?: string;
        reminderTime?: string;
        title: string;
    }) => void;
};

const DIFFICULTY_OPTIONS: { label: string; value: HabitDifficulty }[] = [
    { label: 'Dễ', value: 'easy' },
    { label: 'Vừa', value: 'medium' },
    { label: 'Khó', value: 'hard' },
];

const ICON_OPTIONS = ['📚', '💪', '💧', '📖', '🏃', '🧘', '🎯', '✍️'];

export function AddHabitForm({ onAdd }: AddHabitFormProps) {
    const [title, setTitle] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<string | undefined>();
    const [reminderTime, setReminderTime] = useState('08:00');
    const [difficulty, setDifficulty] = useState<HabitDifficulty>('easy');

    const handleSubmit = () => {
        if (title.trim()) {
            onAdd({
                difficulty,
                icon: selectedIcon,
                reminderTime,
                title: title.trim(),
            });
            setTitle('');
            setSelectedIcon(undefined);
            setReminderTime('08:00');
            setDifficulty('easy');
        }
    };

    return (
        <Box gap="m">
            {/* Habit Name */}
            <Box>
                <Text color="farmCardBgLight" fontSize={12} fontWeight="700" mb="xs">
                    TÊN THÓI QUEN
                </Text>
                <TextInput
                    onChangeText={setTitle}
                    placeholder="Ví dụ: Tập Gym, Học Tiếng Anh..."
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={title}
                />
            </Box>

            {/* Icon and Reminder Time Row */}
            <Box flexDirection="row" gap="m">
                {/* Icon Selector */}
                <Box flex={1}>
                    <Text color="farmCardBgLight" fontSize={12} fontWeight="700" mb="xs">
                        ICON
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            // Simple icon picker - cycle through icons
                            const currentIndex = selectedIcon
                                ? ICON_OPTIONS.indexOf(selectedIcon)
                                : -1;
                            const nextIndex = (currentIndex + 1) % ICON_OPTIONS.length;
                            setSelectedIcon(ICON_OPTIONS[nextIndex]);
                        }}
                    >
                        <Box
                            alignItems="center"
                            backgroundColor="farmCardBgLight"
                            borderColor="farmBorder"
                            borderRadius="s"
                            borderWidth={2}
                            justifyContent="center"
                            minHeight={32}
                            padding="m"
                        >
                            {selectedIcon ? (
                                <Emoji size={18} symbol={selectedIcon} />
                            ) : (
                                <Emoji size={18} symbol="📄" />
                            )}
                        </Box>
                    </TouchableOpacity>
                </Box>

                {/* Reminder Time */}
                <Box flex={1}>
                    <Text color="farmCardBgLight" fontSize={12} fontWeight="700" mb="xs">
                        GIỜ NHẮC
                    </Text>
                    <TextInput
                        onChangeText={setReminderTime}
                        placeholder="08:00"
                        placeholderTextColor="#888"
                        style={styles.input}
                        value={reminderTime}
                    />
                </Box>
            </Box>

            {/* Difficulty Level */}
            <Box>
                <Text color="farmCardBgLight" fontSize={12} fontWeight="700" mb="xs">
                    MỨC ĐỘ KHÓ
                </Text>
                <Box flexDirection="row" gap="s">
                    {DIFFICULTY_OPTIONS.map((option) => (
                        <Box flex={1} key={option.value}>
                            <Button
                                backgroundColor={difficulty === option.value ? 'highlightYellow' : 'farmCardBgLight'}
                                borderColor="farmBorder"
                                borderRadius="s"
                                borderWidth={2}
                                onPress={() => { setDifficulty(option.value); }}
                                paddingVertical="s"
                                textColor={difficulty === option.value ? 'farmBorderDark' : 'textPrimary'}
                                title={option.label}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Submit Button */}
            <Box mt="m">
                <Button
                    backgroundColor="success"
                    borderRadius="m"
                    onPress={handleSubmit}
                    paddingVertical="m"
                    textColor="white"
                    title="GIEO MẦM THÓI QUEN"
                />
            </Box>
        </Box>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#d7ccc8',
        borderColor: '#5d4037',
        borderRadius: 8,
        borderWidth: 2,
        color: '#000',
        fontSize: 13,
        padding: 12,
    },
});

