/**
 * HabitModal Component
 * Habit tracking modal with daily/weekly habits
 */

import React, { useState } from 'react';
import { FlatList, TextInput, StyleSheet } from 'react-native';

import type { HabitFrequency } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { HabitCard } from '@/components/molecules/HabitCard';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

type HabitModalProps = {
  readonly onClose: () => void;
  readonly visible: boolean;
};

export function HabitModal({ onClose, visible }: HabitModalProps) {
  const habits = useGameStore((state) => state.habits);
  const toggleHabitCompletion = useGameStore((state) => state.toggleHabitCompletion);
  const deleteHabit = useGameStore((state) => state.deleteHabit);
  const addHabit = useGameStore((state) => state.addHabit);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState<HabitFrequency>('daily');
  const [newHabitXP, setNewHabitXP] = useState('10');

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitFrequency, parseInt(newHabitXP, 10) || 10);
      setNewHabitName('');
      setNewHabitXP('10');
      setShowAddDialog(false);
    }
  };

  const renderAddDialog = () => {
    if (!showAddDialog) return null;

    return (
      <Box
        backgroundColor="farmCardBgLight"
        borderColor="farmBorder"
        borderRadius="m"
        borderWidth={2}
        mb="m"
        padding="m"
      >
        <Text fontSize={14} fontWeight="700" mb="m">
          ➕ Thêm Nhiệm Vụ Mới
        </Text>

        {/* Habit Name */}
        <Text color="textSecondary" fontSize={11} mb="xs">
          Tên nhiệm vụ:
        </Text>
        <TextInput
          onChangeText={setNewHabitName}
          placeholder="Ví dụ: Đọc sách 30 phút"
          placeholderTextColor="#888"
          style={styles.input}
          value={newHabitName}
        />

        {/* Frequency */}
        <Text color="textSecondary" fontSize={11} mb="xs" mt="m">
          Tần suất:
        </Text>
        <Box flexDirection="row" gap="s" mb="m">
          <Button
            backgroundColor={newHabitFrequency === 'daily' ? 'success' : 'cardBg'}
            borderColor="farmBorder"
            borderRadius="s"
            borderWidth={2}
            flex={1}
            onPress={() => { setNewHabitFrequency('daily'); }}
            paddingVertical="s"
          >
            <Text fontSize={12} fontWeight="600" textAlign="center">
              Hàng ngày
            </Text>
          </Button>
          <Button
            backgroundColor={newHabitFrequency === 'weekly' ? 'success' : 'cardBg'}
            borderColor="farmBorder"
            borderRadius="s"
            borderWidth={2}
            flex={1}
            onPress={() => { setNewHabitFrequency('weekly'); }}
            paddingVertical="s"
          >
            <Text fontSize={12} fontWeight="600" textAlign="center">
              Hàng tuần
            </Text>
          </Button>
        </Box>

        {/* XP Reward */}
        <Text color="textSecondary" fontSize={11} mb="xs">
          Phần thưởng XP:
        </Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={setNewHabitXP}
          placeholder="10"
          placeholderTextColor="#888"
          style={styles.input}
          value={newHabitXP}
        />

        {/* Action Buttons */}
        <Box flexDirection="row" gap="s" mt="m">
          <Button
            backgroundColor="danger"
            borderRadius="s"
            flex={1}
            onPress={() => {
              setShowAddDialog(false);
              setNewHabitName('');
              setNewHabitXP('10');
            }}
            paddingVertical="m"
          >
            <Text fontSize={12} fontWeight="600" textAlign="center">
              Hủy
            </Text>
          </Button>
          <Button
            backgroundColor="success"
            borderRadius="s"
            flex={1}
            onPress={handleAddHabit}
            paddingVertical="m"
          >
            <Text fontSize={12} fontWeight="600" textAlign="center">
              Thêm
            </Text>
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <ModalWrapper onClose={onClose} title="📋 Nhiệm Vụ" visible={visible} width={380}>
      {/* Add Habit Button */}
      {!showAddDialog && (
        <Button
          backgroundColor="success"
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={2}
          mb="m"
          onPress={() => { setShowAddDialog(true); }}
          paddingVertical="m"
        >
          <Text fontSize={13} fontWeight="700" textAlign="center">
            ➕ Thêm Nhiệm Vụ Mới
          </Text>
        </Button>
      )}

      {/* Add Dialog */}
      {renderAddDialog()}

      {/* Habits List */}
      {habits.length === 0 ? (
        <Box alignItems="center" padding="l">
          <Text color="textSecondary" fontSize={14} textAlign="center">
            📋 Chưa có nhiệm vụ nào
          </Text>
          <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
            Thêm nhiệm vụ để kiếm XP và phát triển nông trại
          </Text>
        </Box>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onDelete={deleteHabit}
              onToggle={toggleHabitCompletion}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 400 }}
        />
      )}

      {/* Stats */}
      {habits.length > 0 && (
        <Box
          backgroundColor="farmCardBgLight"
          borderRadius="m"
          mt="m"
          padding="m"
        >
          <Text color="textSecondary" fontSize={11} textAlign="center">
            📊 {habits.filter((h) => h.completedToday).length}/{habits.length} hoàn thành hôm nay
          </Text>
        </Box>
      )}
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderColor: '#5d4037',
    borderRadius: 8,
    borderWidth: 2,
    color: '#000',
    fontSize: 13,
    padding: 10,
  },
});
