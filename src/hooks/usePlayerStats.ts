/**
 * usePlayerStats Hook
 * Player statistics and currency management
 */

import { useGameStore } from '@/stores/gameStore';
import { XP_PER_LEVEL } from '@/constants/game';

export const usePlayerStats = () => {
  const money = useGameStore((state) => state.money);
  const diamonds = useGameStore((state) => state.diamonds);
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);

  const addMoney = useGameStore((state) => state.addMoney);
  const spendMoney = useGameStore((state) => state.spendMoney);
  const addDiamonds = useGameStore((state) => state.addDiamonds);
  const addXP = useGameStore((state) => state.addXP);

  // Calculate XP progress in current level (0-100%)
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

  return {
    addDiamonds,
    addMoney,
    addXP,
    diamonds,
    level,
    money,
    spendMoney,
    xp,
    xpProgress,
  };
};
