/**
 * HabitModal Component
 * Habit tracking modal with daily/weekly habits
 */

import type { HabitFrequency } from '@/types/game';

import { useState } from 'react';
import { FlatList, StyleSheet, TextInput } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { HabitCard } from '@/components/molecules/HabitCard';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { useGameStore } from '@/stores/gameStore';

const DEFAULT_XP_REWARD = 10;

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
      addHabit({
        frequency: newHabitFrequency,
        title: newHabitName.trim(),
        xpReward: Number.parseInt(newHabitXP, 10) || DEFAULT_XP_REWARD,
      });
      setNewHabitName('');
      setNewHabitXP('10');
      setShowAddDialog(false);
    }
  };

  const handleToggleHabit = (habitId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    toggleHabitCompletion(habitId, today.getTime());
  };

  const getCompletedTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    return habits.filter((h) => h.completionDates.includes(todayTimestamp)).length;
  };

  const renderAddDialog = () => {
    if (!showAddDialog) return undefined;

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
          <Box flex={1}>
            <Button
              backgroundColor={newHabitFrequency === 'daily' ? 'success' : 'cardBg'}
              borderColor="farmBorder"
              borderRadius="s"
              borderWidth={2}
              onPress={() => { setNewHabitFrequency('daily'); }}
              paddingVertical="s"
              textColor="textPrimary"
              title="Hàng ngày"
            />
          </Box>
          <Box flex={1}>
            <Button
              backgroundColor={newHabitFrequency === 'weekly' ? 'success' : 'cardBg'}
              borderColor="farmBorder"
              borderRadius="s"
              borderWidth={2}
              onPress={() => { setNewHabitFrequency('weekly'); }}
              paddingVertical="s"
              textColor="textPrimary"
              title="Hàng tuần"
            />
          </Box>
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
          <Box flex={1}>
            <Button
              backgroundColor="danger"
              borderRadius="s"
              onPress={() => {
                setShowAddDialog(false);
                setNewHabitName('');
                setNewHabitXP('10');
              }}
              paddingVertical="m"
              textColor="textPrimary"
              title="Hủy"
            />
          </Box>
          <Box flex={1}>
            <Button
              backgroundColor="success"
              borderRadius="s"
              onPress={handleAddHabit}
              paddingVertical="m"
              textColor="textPrimary"
              title="Thêm"
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <ModalWrapper onClose={onClose} title="📋 Nhiệm Vụ" visible={visible} width={380}>
      {/* Add Habit Button */}
      {!showAddDialog && (
        <Box mb="m">
          <Button
            backgroundColor="success"
            borderColor="farmBorder"
            borderRadius="m"
            borderWidth={2}
            onPress={() => { setShowAddDialog(true); }}
            paddingVertical="m"
            textColor="textPrimary"
            title="➕ Thêm Nhiệm Vụ Mới"
          />
        </Box>
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
              onToggle={handleToggleHabit}
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
            📊 {getCompletedTodayCount()}/{habits.length} hoàn thành hôm nay
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
