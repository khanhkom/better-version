/**
 * EditHabitForm Component
 * Form for editing an existing habit with name, icon, reminder time, frequency, and difficulty
 */

import type { DayOfWeek, Habit, HabitDifficulty, HabitFrequency } from '@/types/game';

import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

type EditHabitFormProps = {
    readonly habit: Habit;
    readonly onDelete?: () => void;
    readonly onUpdate: (data: {
        difficulty: HabitDifficulty;
        frequency: HabitFrequency;
        icon?: string;
        reminderTime?: string;
        title: string;
        weeklyDays?: DayOfWeek[];
    }) => void;
};

const DIFFICULTY_OPTIONS: { label: string; value: HabitDifficulty }[] = [
    { label: 'Dễ', value: 'easy' },
    { label: 'Vừa', value: 'medium' },
    { label: 'Khó', value: 'hard' },
];

const FREQUENCY_OPTIONS: { label: string; value: HabitFrequency }[] = [
    { label: '1 lần', value: 'once' },
    { label: 'Hằng ngày', value: 'daily' },
    { label: 'Hằng tuần', value: 'weekly' },
];

const WEEKDAY_OPTIONS: { label: string; value: DayOfWeek }[] = [
    { label: 'T2', value: 'mon' },
    { label: 'T3', value: 'tue' },
    { label: 'T4', value: 'wed' },
    { label: 'T5', value: 'thu' },
    { label: 'T6', value: 'fri' },
    { label: 'T7', value: 'sat' },
    { label: 'CN', value: 'sun' },
];

const ICON_OPTIONS = ['📚', '💪', '💧', '📖', '🏃', '🧘', '🎯', '✍️'];

export function EditHabitForm({ habit, onDelete, onUpdate }: EditHabitFormProps) {
    const [title, setTitle] = useState(habit.title);
    const [selectedIcon, setSelectedIcon] = useState<string | undefined>(habit.icon);
    const [reminderTime, setReminderTime] = useState(habit.reminderTime ?? '08:00');
    const [difficulty, setDifficulty] = useState<HabitDifficulty>(habit.difficulty);
    const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency);
    const [weeklyDays, setWeeklyDays] = useState<DayOfWeek[]>(habit.weeklyDays ?? []);

    const toggleWeekday = (day: DayOfWeek) => {
        setWeeklyDays((previous) =>
            previous.includes(day) ? previous.filter((d) => d !== day) : [...previous, day]
        );
    };

    const handleSubmit = () => {
        if (title.trim()) {
            onUpdate({
                difficulty,
                frequency,
                icon: selectedIcon,
                reminderTime,
                title: title.trim(),
                weeklyDays: frequency === 'weekly' ? weeklyDays : undefined,
            });
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

            {/* Frequency */}
            <Box>
                <Text color="farmCardBgLight" fontSize={12} fontWeight="700" mb="xs">
                    TẦN SUẤT
                </Text>
                <Box flexDirection="row" gap="s">
                    {FREQUENCY_OPTIONS.map((option) => (
                        <Box flex={1} key={option.value}>
                            <Button
                                backgroundColor={frequency === option.value ? 'highlightYellow' : 'farmCardBgLight'}
                                borderColor="farmBorder"
                                borderRadius="s"
                                borderWidth={2}
                                onPress={() => {
                                    setFrequency(option.value);
                                    if (option.value !== 'weekly') {
                                        setWeeklyDays([]);
                                    }
                                }}
                                paddingHorizontal='xs'
                                paddingVertical="s"
                                textColor={frequency === option.value ? 'farmBorderDark' : 'textPrimary'}
                                title={option.label}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Weekly Days Selector - Only show if weekly */}
            {frequency === 'weekly' ? (
                <Box>
                    <Text color="farmCardBgLight" fontSize={12} fontWeight="700" mb="xs">
                        CHỌN CÁC NGÀY
                    </Text>
                    <Box flexDirection="row" flexWrap="wrap" gap="xs">
                        {WEEKDAY_OPTIONS.map((option) => (
                            <Box key={option.value} width="13%">
                                <Button
                                    backgroundColor={weeklyDays.includes(option.value) ? 'success' : 'farmCardBgLight'}
                                    borderColor="farmBorder"
                                    borderRadius="s"
                                    borderWidth={2}
                                    fontSize={12}
                                    onPress={() => { toggleWeekday(option.value); }}
                                    paddingHorizontal='xxs'
                                    paddingVertical="s"
                                    textColor={weeklyDays.includes(option.value) ? 'white' : 'textPrimary'}
                                    title={option.label}

                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            ) : undefined}

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

            {/* Action Buttons */}
            <Box flexDirection="row" gap="m" mt="m">
                {/* Delete Button */}
                {onDelete ? (
                    <Box flex={1}>
                        <Button
                            backgroundColor="danger"
                            borderRadius="m"
                            onPress={onDelete}
                            paddingVertical="m"
                            textColor="white"
                            title="XÓA"
                        />
                    </Box>
                ) : undefined}

                {/* Update Button */}
                <Box flex={1}>
                    <Button
                        backgroundColor="success"
                        borderRadius="m"
                        onPress={handleSubmit}
                        paddingVertical="m"
                        textColor="white"
                        title="CẬP NHẬT"
                    />
                </Box>
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
