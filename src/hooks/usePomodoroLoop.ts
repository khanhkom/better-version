/**
 * usePomodoroLoop Hook
 * Pomodoro timer loop with background/foreground handling
 */

import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useGameStore } from '@/stores/gameStore';

export const usePomodoroLoop = () => {
  const pomodoro = useGameStore((state) => state.pomodoro);
  const tickPomodoro = useGameStore((state) => state.tickPomodoro);
  const completePomodoro = useGameStore((state) => state.completePomodoro);

  // Tick every second
  useEffect(() => {
    if (!pomodoro.isRunning) return;

    const interval = setInterval(() => {
      tickPomodoro();
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoro.isRunning, tickPomodoro]);

  // Handle background/foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        nextAppState === 'active' &&
        pomodoro.isRunning &&
        pomodoro.startedAt
      ) {
        // Calculate elapsed time while backgrounded
        const elapsed = Math.floor((Date.now() - pomodoro.startedAt) / 1000);
        const newRemaining = Math.max(0, pomodoro.remaining - elapsed);

        useGameStore.setState((state) => ({
          pomodoro: {
            ...state.pomodoro,
            remaining: newRemaining,
            startedAt: Date.now(),
          },
        }));

        if (newRemaining <= 0) {
          completePomodoro();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [pomodoro, completePomodoro]);
};
