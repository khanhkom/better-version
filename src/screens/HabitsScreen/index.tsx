/**
 * HabitsScreen
 * Habit tracking screen for daily tasks
 */

import type { DayOfWeek, Habit } from '@/types/game';

import { useFocusEffect } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Rive, { Fit, RiveGeneralEvent, RNRiveError, RNRiveErrorType, useRive } from 'rive-react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { scaleHeight, scaleWidth } from '@/configs/functions';
import { useGameStore } from '@/stores/gameStore';

import {
    AddHabitForm,
    EditHabitForm,
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

    const [setRiveReference, riveReference] = useRive();

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
    //#0c2606
    return (
        <LinearGradient
            colors={['#3e802f', '#3e802f']}
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#79c042"
                barStyle="light-content"
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ height: scaleHeight(315) }}>
                        <Rive
                            artboardName="v_1 for Rive 2"
                            autoplay
                            fit={Fit.FitWidth}
                            onError={(riveError: RNRiveError) => {
                                switch (riveError.type) {
                                    case RNRiveErrorType.DataBindingError: {
                                        console.error(riveError.message);
                                        return;
                                    }
                                    default: {
                                        console.error('Unhandled error', riveError);
                                        return;
                                    }
                                }
                            }}
                            onRiveEventReceived={(event: RiveGeneralEvent) => {
                                console.log('event', event);
                            }}
                            onStateChanged={(stateMachineName: string) => {
                                console.log('stateMachineName', stateMachineName);
                            }}
                            ref={setRiveReference}
                            resourceName="nature"
                            stateMachineName="Start"
                            style={{ marginTop: -20, width: scaleWidth(375) }}
                        // url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
                        />
                    </View>
                    {/* Header */}
                    <Box padding="m">
                        <Text color="white" fontSize={24} fontWeight="700" mb="m">
                            Nhiệm Vụ Hôm Nay
                        </Text>
                    </Box>

                    {/* Content */}
                    <Box padding="m">
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
                            <>
                                {habits.map((item) => {
                                    // Check if completed today
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const todayTimestamp = today.getTime();
                                    const isCompleted = item.completionDates.includes(todayTimestamp);

                                    return (
                                        <TaskCard
                                            habit={item}
                                            isCompleted={isCompleted}
                                            key={item.id}
                                            onDelete={handleDelete}
                                            onEdit={handleEdit}
                                            onPlant={handlePlant}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Glass Add Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { setShowAddModal(true); }}
                        >
                            <Box
                                alignItems="center"
                                backgroundColor="habitBgWhite"
                                borderColor="habitBorderLight"
                                borderRadius="xl"
                                borderWidth={2}
                                flexDirection="row"
                                gap="s"
                                justifyContent="center"
                                marginTop="m"
                                paddingVertical="l"
                                style={{
                                    opacity: 0.8,
                                }}
                            >
                                <Plus color="#4CAF50" size={20} />
                                <Text color="breakGreen" fontSize={14} fontWeight="600">
                                    Thêm nhiệm vụ mới
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
    },
});
