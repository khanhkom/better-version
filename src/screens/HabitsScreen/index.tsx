/**
 * HabitsScreen
 * Habit tracking screen for daily tasks
 */

import type { DayOfWeek, Habit } from '@/types/game';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { useGameStore } from '@/stores/gameStore';

import {
    AddHabitForm,
    EditHabitForm,
    FloatingButton,
    TaskCard,
} from './components';

export function HabitsScreen() {
    const habits = useGameStore((state) => state.habits);
    const toggleHabitCompletion = useGameStore((state) => state.toggleHabitCompletion);
    const addHabit = useGameStore((state) => state.addHabit);
    const deleteHabit = useGameStore((state) => state.deleteHabit);
    const updateHabit = useGameStore((state) => state.updateHabit);
    const addMoney = useGameStore((state) => state.addMoney);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

    // Update StatusBar color when screen is focused
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#6A1B9A');
        }, [])
    );

    const handlePlant = (habitId: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        const habit = habits.find((h) => h.id === habitId);
        if (habit) {
            // Check if already completed today
            const isCompleted = habit.completionDates.includes(todayTimestamp);
            if (!isCompleted) {
                toggleHabitCompletion(habitId, todayTimestamp);
                // Award money and XP
                addMoney(habit.moneyReward);
            }
        }
    };

    const handleDelete = (habitId: string) => {
        deleteHabit(habitId);
    };

    const handleEdit = (habitId: string) => {
        const habit = habits.find((h) => h.id === habitId);
        if (habit) {
            setEditingHabit(habit);
            setShowEditModal(true);
        }
    };

    const handleUpdateHabit = (data: {
        difficulty: 'easy' | 'hard' | 'medium';
        frequency: 'daily' | 'once' | 'weekly';
        icon?: string;
        reminderTime?: string;
        title: string;
        weeklyDays?: DayOfWeek[];
    }) => {
        if (editingHabit) {
            updateHabit(editingHabit.id, {
                difficulty: data.difficulty,
                frequency: data.frequency,
                icon: data.icon,
                reminderTime: data.reminderTime,
                title: data.title,
                weeklyDays: data.weeklyDays,
            });
            setShowEditModal(false);
            setEditingHabit(undefined);
        }
    };

    const handleAddHabit = (data: {
        difficulty: 'easy' | 'hard' | 'medium';
        frequency: 'daily' | 'once' | 'weekly';
        icon?: string;
        reminderTime?: string;
        title: string;
        weeklyDays?: DayOfWeek[];
    }) => {
        addHabit({
            difficulty: data.difficulty,
            frequency: data.frequency,
            icon: data.icon,
            moneyReward: 0, // Will be calculated in store
            reminderTime: data.reminderTime,
            title: data.title,
            weeklyDays: data.weeklyDays,
            xpReward: 0, // Will be calculated in store
        });
        setShowAddModal(false);
    };

    return (
        <LinearGradient
            colors={['#AB47BC', '#7B1FA2']}
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#6A1B9A"
                barStyle="light-content"
            />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Box padding="m">
                    <Text color="white" fontSize={24} fontWeight="700" mb="m">
                        ✅ Nhiệm Vụ
                    </Text>
                </Box>

                {/* Content */}
                <Box flex={1} padding="m">
                    {habits.length === 0 ? (
                        <Box alignItems="center" padding="l">
                            <Text color="farmCardBgLight" fontSize={14} textAlign="center">
                                📋 Chưa có nhiệm vụ nào
                            </Text>
                            <Text color="farmCardBgLight" fontSize={11} mt="xs" textAlign="center">
                                Thêm nhiệm vụ để kiếm XP và phát triển nông trại
                            </Text>
                        </Box>
                    ) : (
                        <FlatList
                            data={habits}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                // Check if completed today
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const todayTimestamp = today.getTime();
                                const isCompleted = item.completionDates.includes(todayTimestamp);

                                return (
                                    <TaskCard
                                        habit={item}
                                        isCompleted={isCompleted}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                        onPlant={handlePlant}
                                    />
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </Box>

                {/* Floating Add Button */}
                <FloatingButton onPress={() => { setShowAddModal(true); }} />
            </SafeAreaView>

            {/* Add Habit Modal */}
            <ModalWrapper
                onClose={() => { setShowAddModal(false); }}
                title="Thêm Thói Quen"
                visible={showAddModal}
            >
                <AddHabitForm onAdd={handleAddHabit} />
            </ModalWrapper>

            {/* Edit Habit Modal */}
            <ModalWrapper
                onClose={() => {
                    setShowEditModal(false);
                    setEditingHabit(undefined);
                }}
                title="Chỉnh Sửa Thói Quen"
                visible={showEditModal}
            >
                {editingHabit ? (
                    <EditHabitForm
                        habit={editingHabit}
                        onDelete={() => {
                            handleDelete(editingHabit.id);
                            setShowEditModal(false);
                            setEditingHabit(undefined);
                        }}
                        onUpdate={handleUpdateHabit}
                    />
                ) : undefined}
            </ModalWrapper>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});
