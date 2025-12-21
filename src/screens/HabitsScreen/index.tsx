/**
 * HabitsScreen
 * Habit tracking screen with tabs for Tasks, Statistics, and Add
 */

import type { DayOfWeek, Habit } from '@/types/game';

import { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { useGameStore } from '@/stores/gameStore';

import {
    AddHabitForm,
    DAYS_OF_WEEK,
    EditHabitForm,
    FloatingButton,
    HabitRow,
    TabNavigation,
    type TabType,
    TaskCard,
} from './components';

export function HabitsScreen() {
    const habits = useGameStore((state) => state.habits);
    const toggleHabitCompletion = useGameStore((state) => state.toggleHabitCompletion);
    const addHabit = useGameStore((state) => state.addHabit);
    const deleteHabit = useGameStore((state) => state.deleteHabit);
    const updateHabit = useGameStore((state) => state.updateHabit);
    const addMoney = useGameStore((state) => state.addMoney);

    const [activeTab, setActiveTab] = useState<TabType>('tasks');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

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

    const renderContent = () => {
        switch (activeTab) {
            case 'statistics': {
                return (
                    <Box flex={1}>
                        {/* Header */}
                        <Box
                            backgroundColor="farmBorderDark"
                            borderRadius='m'
                            flexDirection="row"
                            justifyContent="space-between"
                            marginBottom='m'
                            padding="m"
                        >
                            <Text color="white" fontSize={12} fontWeight="700">
                                THÓI QUEN
                            </Text>
                            <Box alignItems='center' flexDirection="row" gap="xxl">
                                <Box flexDirection="row" gap="xs">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <Text color="white" fontSize={10} key={day}>
                                            {day}
                                        </Text>
                                    ))}
                                </Box>
                                <Text color="white" fontSize={12} fontWeight="700">
                                    CHUỖI
                                </Text>
                            </Box>
                        </Box>

                        {/* Habit Rows */}
                        {habits.length === 0 ? (
                            <Box alignItems="center" padding="l">
                                <Text color="farmCardBgLight" fontSize={14} textAlign="center">
                                    📋 Chưa có thói quen nào
                                </Text>
                            </Box>
                        ) : (
                            <FlatList
                                data={habits}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <HabitRow habit={item} />}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </Box>
                );
            }

            case 'tasks': {
                return (
                    <Box flex={1}>
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
                );
            }

            default: {
                return undefined;
            }
        }
    };

    return (
        <LinearGradient
            colors={['#8d6e63', '#8d6e63']}
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#5d4037"
                barStyle="light-content"
            />
            <SafeAreaView style={styles.safeArea}>
                {/* Header with Tabs and Close Button */}
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                {/* Content */}
                <Box flex={1} padding="m">
                    {renderContent()}
                </Box>

                {/* Footer Message */}
                <Box
                    backgroundColor="farmBorderDark"
                    padding="m"
                >
                    <Text color="farmCardBgLight" fontSize={12} textAlign="center">
                        Duy trì chuỗi 🔥 để nhận thêm nhiều may mắn!
                    </Text>
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
