/**
 * useAutoSave Hook
 * Auto-save game state every 5 seconds
 */

import { useEffect } from 'react';

import { AUTO_SAVE_INTERVAL } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

export const useAutoSave = () => {
  const save = useGameStore((state) => state.save);

  useEffect(() => {
    const interval = setInterval(() => {
      save();
      if (__DEV__) {
        console.log('[AutoSave] Game state saved');
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [save]);
};
