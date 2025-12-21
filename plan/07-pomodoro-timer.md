# 07 - Pomodoro Timer

**Date:** 2025-12-22
**Priority:** 🟡 P1
**Status:** Draft

---

## FocusTimerModal

```typescript
// src/components/modals/FocusTimerModal.tsx
import React from 'react';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';
import { PomodoroTimer } from '@/components/organisms/PomodoroTimer';
import { useGameStore } from '@/stores/gameStore';

type FocusTimerModalProps = {
  visible: boolean;
};

export const FocusTimerModal = ({ visible }: FocusTimerModalProps) => {
  const closeModal = useGameStore((state) => state.closeModal);
  const toggleMinimize = useGameStore((state) => state.toggleMinimizePomodoro);

  const handleMinimize = () => {
    toggleMinimize();
    closeModal();
  };

  return (
    <ModalWrapper visible={visible} onClose={closeModal} title="🍅 Tập Trung">
      <PomodoroTimer onMinimize={handleMinimize} />
    </ModalWrapper>
  );
};
```

---

## PomodoroTimer Component

```typescript
// src/components/organisms/PomodoroTimer.tsx
import React from 'react';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { CircularProgress } from '@/components/atoms/CircularProgress';
import { useGameStore } from '@/stores/gameStore';

type PomodoroTimerProps = {
  onMinimize: () => void;
};

export const PomodoroTimer = ({ onMinimize }: PomodoroTimerProps) => {
  const pomodoro = useGameStore((state) => state.pomodoro);
  const startPomodoro = useGameStore((state) => state.startPomodoro);
  const pausePomodoro = useGameStore((state) => state.pausePomodoro);
  const resumePomodoro = useGameStore((state) => state.resumePomodoro);
  const resetPomodoro = useGameStore((state) => state.resetPomodoro);

  const progress = ((pomodoro.duration - pomodoro.remaining) / pomodoro.duration) * 100;
  const minutes = Math.floor(pomodoro.remaining / 60);
  const seconds = pomodoro.remaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const color = pomodoro.mode === 'FOCUS' ? '#ef5350' : '#66bb6a';

  return (
    <Box alignItems="center" gap="l">
      {/* Circular Timer */}
      <Box position="relative">
        <CircularProgress
          progress={progress}
          size={250}
          strokeWidth={16}
          color={color}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="pixelHeader" fontSize={48}>
            {timeDisplay}
          </Text>
          <Text variant="farmLabel" mt="s">
            {pomodoro.mode === 'FOCUS' ? '🍅 Focus' : '☕ Break'}
          </Text>
        </Box>
      </Box>

      {/* Controls */}
      <Box flexDirection="row" gap="m">
        {pomodoro.mode === 'IDLE' && (
          <>
            <Button variant="farmButton" onPress={() => startPomodoro('FOCUS')}>
              Start Focus (25min)
            </Button>
            <Button variant="farmButton" onPress={() => startPomodoro('BREAK')}>
              Start Break (5min)
            </Button>
          </>
        )}

        {pomodoro.mode !== 'IDLE' && (
          <>
            {pomodoro.isRunning ? (
              <Button variant="warning" onPress={pausePomodoro}>
                ⏸️ Pause
              </Button>
            ) : (
              <Button variant="success" onPress={resumePomodoro}>
                ▶️ Resume
              </Button>
            )}
            <Button variant="danger" onPress={resetPomodoro}>
              🔄 Reset
            </Button>
            <Button variant="farmButton" onPress={onMinimize}>
              ➖ Minimize
            </Button>
          </>
        )}
      </Box>

      {/* Stats */}
      <Box backgroundColor="farmCardBgLight" p="m" borderRadius="m" alignSelf="stretch">
        <Text variant="farmLabel">Sessions Completed: {pomodoro.completedSessions}</Text>
        <Text variant="body" color="textTertiary" mt="xs">
          Reward: +50 XP, +25💰 per focus session
        </Text>
      </Box>
    </Box>
  );
};
```

---

## Minimized Widget

```typescript
// src/components/organisms/MinimizedPomodoroWidget.tsx
import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { useGameStore } from '@/stores/gameStore';

export const MinimizedPomodoroWidget = () => {
  const pomodoro = useGameStore((state) => state.pomodoro);
  const minimized = useGameStore((state) => state.minimizedPomodoro);
  const openModal = useGameStore((state) => state.openModal);
  const toggleMinimize = useGameStore((state) => state.toggleMinimizePomodoro);

  if (!minimized || pomodoro.mode === 'IDLE') return null;

  const minutes = Math.floor(pomodoro.remaining / 60);
  const seconds = pomodoro.remaining % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const handlePress = () => {
    toggleMinimize();
    openModal('POMODORO');
  };

  return (
    <Pressable onPress={handlePress}>
      <Box
        position="absolute"
        top={100}
        right={16}
        backgroundColor={pomodoro.mode === 'FOCUS' ? 'focusRed' : 'breakGreen'}
        borderRadius="full"
        p="m"
        shadowColor="black"
        shadowOpacity={0.3}
        shadowRadius={8}
        elevation={8}
      >
        <Text variant="pixelBody" color="textPrimary" fontSize={16}>
          {pomodoro.isRunning ? '⏱️' : '⏸️'} {timeDisplay}
        </Text>
      </Box>
    </Pressable>
  );
};
```

---

## Background Timer

Uses `usePomodoroLoop` hook from [Plan 02](./02-state-management.md) which handles:
- Ticking every second
- Background/foreground transitions
- Calculating elapsed time when app returns to foreground

---

## Next Steps

1. ⬜ Create FocusTimerModal
2. ⬜ Create PomodoroTimer organism
3. ⬜ Create MinimizedPomodoroWidget
4. ⬜ Test timer accuracy
5. ⬜ Test background behavior
6. ⬜ Add sound/haptic notifications
