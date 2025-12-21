# 04 - Farm Screen Implementation

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Dependencies:** [02-state-management.md](./02-state-management.md), [03-component-architecture.md](./03-component-architecture.md)
**Status:** Draft

---

## Screen Layout

```
┌─────────────────────────────────┐
│ FarmHeader (Stats + Level)      │
├─────────────────────────────────┤
│                                 │
│  FarmGrid (2x3 plots)           │
│  ┌──┬──┐                        │
│  │🍅│🌱│                        │
│  ├──┼──┤                        │
│  │🥕│  │                        │
│  ├──┼──┤                        │
│  │  │🌽│                        │
│  └──┴──┘                        │
│                                 │
├─────────────────────────────────┤
│ AdviceBox (Gemini AI)           │
├─────────────────────────────────┤
│ NavigationBar (4 buttons)       │
│ [Nhiệm Vụ][Tập Trung][Kho][Shop]│
└─────────────────────────────────┘
```

---

## Implementation

```typescript
// src/screens/FarmGameScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Box } from '@/components/atoms/Box';
import { FarmHeader } from '@/components/organisms/FarmHeader';
import { FarmGrid } from '@/components/organisms/FarmGrid';
import { AdviceBox } from '@/components/organisms/AdviceBox';
import { NavigationBar } from '@/components/organisms/NavigationBar';
import { HabitBoardModal } from '@/components/modals/HabitBoardModal';
import { FocusTimerModal } from '@/components/modals/FocusTimerModal';
import { ShopModal } from '@/components/modals/ShopModal';
import { ActionToolbar } from '@/components/organisms/ActionToolbar';
import { useFarm } from '@/hooks/useFarm';
import { useGameStore } from '@/stores/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { usePomodoroLoop } from '@/hooks/usePomodoroLoop';
import { useAutoSave } from '@/hooks/useAutoSave';

export const FarmGameScreen = () => {
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  const { plots, selectedTool, handlePlotClick } = useFarm();
  const activeModal = useGameStore((state) => state.activeModal);
  const openModal = useGameStore((state) => state.openModal);

  // Game loops
  useGameLoop();
  usePomodoroLoop();
  useAutoSave();

  const handlePlotPress = (plotId: string) => {
    const plot = plots.find((p) => p.id === plotId);
    if (!plot) return;

    if (plot.status === 'READY') {
      handlePlotClick(plotId);
    } else if (plot.status === 'EMPTY' && selectedTool === 'PLANT') {
      setSelectedPlotId(plotId);
      setShowCropSelector(true);
    }
  };

  return (
    <LinearGradient
      colors={['#2d5a27', '#3a7332']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FarmHeader />

        <FarmGrid plots={plots} onPlotPress={handlePlotPress} />

        <AdviceBox />

        <NavigationBar
          onHabitsPress={() => openModal('HABITS')}
          onFocusPress={() => openModal('POMODORO')}
          onShopPress={() => openModal('SHOP')}
        />

        <ActionToolbar />

        {/* Modals */}
        <HabitBoardModal visible={activeModal === 'HABITS'} />
        <FocusTimerModal visible={activeModal === 'POMODORO'} />
        <ShopModal visible={activeModal === 'SHOP'} />

        {/* Crop Selector (inline modal) */}
        {showCropSelector && (
          <CropSelectorModal
            visible={showCropSelector}
            plotId={selectedPlotId}
            onClose={() => setShowCropSelector(false)}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
```

---

## NavigationBar Component

```typescript
// src/components/organisms/NavigationBar.tsx
import React from 'react';
import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';

type NavigationBarProps = {
  onHabitsPress: () => void;
  onFocusPress: () => void;
  onShopPress: () => void;
};

export const NavigationBar = ({
  onHabitsPress,
  onFocusPress,
  onShopPress,
}: NavigationBarProps) => (
  <Box flexDirection="row" gap="s" p="m">
    <Button
      variant="farmButton"
      onPress={onHabitsPress}
      flex={1}
    >
      📋 Nhiệm Vụ
    </Button>
    <Button
      variant="farmButton"
      onPress={onFocusPress}
      flex={1}
    >
      🍅 Tập Trung
    </Button>
    <Button
      variant="farmButton"
      onPress={onShopPress}
      flex={1}
    >
      🏪 Cửa hàng
    </Button>
  </Box>
);
```

---

## ActionToolbar Component

```typescript
// src/components/organisms/ActionToolbar.tsx
import React from 'react';
import { Box } from '@/components/atoms/Box';
import { IconButton } from '@/components/atoms/IconButton';
import { useGameStore } from '@/stores/gameStore';
import type { ToolType } from '@/types/game';

const TOOLS: { type: ToolType; icon: string; label: string }[] = [
  { type: 'WATER', icon: '💧', label: 'Water' },
  { type: 'DIG', icon: '🔨', label: 'Dig' },
  { type: 'PLANT', icon: '🌱', label: 'Plant' },
];

export const ActionToolbar = () => {
  const selectedTool = useGameStore((state) => state.selectedTool);
  const selectTool = useGameStore((state) => state.selectTool);

  return (
    <Box
      position="absolute"
      bottom={100}
      right={16}
      gap="s"
    >
      {TOOLS.map((tool) => (
        <IconButton
          key={tool.type}
          icon={tool.icon}
          onPress={() => selectTool(tool.type)}
          isActive={selectedTool === tool.type}
          label={tool.label}
        />
      ))}
    </Box>
  );
};
```

---

## AdviceBox Component

```typescript
// src/components/organisms/AdviceBox.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/atoms/Card';
import { Text } from '@/components/atoms/Text';
import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';
import { getGeminiAdvice } from '@/services/gemini';
import { useGameStore } from '@/stores/gameStore';

export const AdviceBox = () => {
  const [advice, setAdvice] = useState<string>('Welcome to your farm! 🌱');
  const [loading, setLoading] = useState(false);
  const gameState = useGameStore();

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const newAdvice = await getGeminiAdvice(gameState);
      setAdvice(newAdvice);
    } catch (error) {
      setAdvice('Could not fetch advice. Keep farming! 🚜');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p="m">
      <Card variant="farmModal" p="m">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb="s">
          <Text variant="pixelHeader" fontSize={14}>
            🧙 Gemini Advice
          </Text>
          <Button
            variant="farmButton"
            onPress={fetchAdvice}
            disabled={loading}
            size="sm"
          >
            {loading ? '...' : '🔄'}
          </Button>
        </Box>
        <Text variant="body" color="textSecondary">
          {advice}
        </Text>
      </Card>
    </Box>
  );
};
```

---

## Next Steps

1. ✅ Review layout structure
2. ⬜ Implement FarmGameScreen
3. ⬜ Build NavigationBar
4. ⬜ Build ActionToolbar
5. ⬜ Build AdviceBox
6. ⬜ Test screen with mock data
7. ⬜ Proceed to Plan 05: Modal System

---

## References

- Web main screen: [src/web/App.tsx](../src/web/App.tsx)
- State hooks: [src/hooks/](../src/hooks/)
