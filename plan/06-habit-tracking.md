# 06 - Habit Tracking

**Date:** 2025-12-22
**Priority:** 🟡 P1
**Status:** Draft

---

## HabitBoardModal Structure

3 tabs:
1. **Nhiệm Vụ** - Habit list with streak display
2. **Thống Kê** - 7-day completion grid
3. **Thêm** - Add new habit form

---

## Implementation

```typescript
// src/components/modals/HabitBoardModal.tsx
import React, { useState } from 'react';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';
import { TabBar } from '@/components/molecules/TabBar';
import { HabitList } from '@/components/organisms/HabitList';
import { HabitStats } from '@/components/organisms/HabitStats';
import { AddHabitForm } from '@/components/organisms/AddHabitForm';
import { useGameStore } from '@/stores/gameStore';

type HabitBoardModalProps = {
  visible: boolean;
};

export const HabitBoardModal = ({ visible }: HabitBoardModalProps) => {
  const [activeTab, setActiveTab] = useState('list');
  const closeModal = useGameStore((state) => state.closeModal);

  const tabs = [
    { id: 'list', label: 'Nhiệm Vụ', icon: '📋' },
    { id: 'stats', label: 'Thống Kê', icon: '📊' },
    { id: 'add', label: 'Thêm', icon: '➕' },
  ];

  return (
    <ModalWrapper visible={visible} onClose={closeModal} title="📋 Nhiệm Vụ">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'list' && <HabitList />}
      {activeTab === 'stats' && <HabitStats />}
      {activeTab === 'add' && <AddHabitForm />}
    </ModalWrapper>
  );
};
```

---

## HabitItem Component

```typescript
// src/components/molecules/HabitItem.tsx
import React from 'react';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import type { Habit } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';

type HabitItemProps = {
  habit: Habit;
};

export const HabitItem = ({ habit }: HabitItemProps) => {
  const toggleCompletion = useGameStore((state) => state.toggleHabitCompletion);
  const today = new Date().setHours(0, 0, 0, 0);
  const isCompletedToday = habit.completionDates.includes(today);

  return (
    <Box
      backgroundColor="farmCardBgLight"
      borderRadius="m"
      p="m"
      mb="s"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box flex={1}>
        <Text variant="farmLabel" fontSize={16}>
          {habit.title}
        </Text>
        {habit.description && (
          <Text variant="body" color="textTertiary" fontSize={12}>
            {habit.description}
          </Text>
        )}
        <Box flexDirection="row" gap="s" mt="xs">
          <Badge variant="orange" label={`${habit.streak}🔥 Streak`} />
          <Badge variant="blue" label={`+${habit.xpReward} XP`} />
        </Box>
      </Box>

      <Button
        variant={isCompletedToday ? 'success' : 'farmButton'}
        onPress={() => toggleCompletion(habit.id, today)}
        size="sm"
      >
        {isCompletedToday ? '✅' : '⭕'}
      </Button>
    </Box>
  );
};
```

---

## Streak Calculation

```typescript
// Implemented in gameStore.ts - updateHabitStreak action
// Calculates consecutive days from completion dates
```

---

## Next Steps

1. ⬜ Create HabitBoardModal
2. ⬜ Create HabitList organism
3. ⬜ Create HabitItem molecule
4. ⬜ Create HabitStats (7-day grid)
5. ⬜ Create AddHabitForm
6. ⬜ Test habit completion & streak logic
