# 02 - State Management: Game State Architecture

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Dependencies:** [01-design-system-sync.md](./01-design-system-sync.md)
**Status:** Draft

---

## Objective

Design robust game state management using Zustand with MMKV persistence, ensuring type safety, optimistic updates, and data integrity for the farm game.

---

## State Structure

### Game State Type Definition

```typescript
// src/types/game.ts

/** Crop identifiers */
export type CropId = 'tomato' | 'carrot' | 'corn' | 'watermelon';

/** Plot status states */
export type PlotStatus = 'EMPTY' | 'PLANTED' | 'READY';

/** Tool types */
export type ToolType = 'WATER' | 'DIG' | 'PLANT' | null;

/** Pomodoro mode */
export type PomodoroMode = 'FOCUS' | 'BREAK' | 'IDLE';

/** Habit frequency */
export type HabitFrequency = 'daily' | 'weekly';

/** Crop configuration */
export type Crop = {
  id: CropId;
  name: string;
  icon: string;
  growthTime: number;      // seconds
  buyPrice: number;
  sellPrice: number;
  xpReward: number;
};

/** Land plot */
export type LandPlot = {
  id: string;
  status: PlotStatus;
  cropId?: CropId;
  plantedAt?: number;      // Unix timestamp (ms)
  progress: number;        // 0-100
};

/** Habit item */
export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  createdAt: number;
  completionDates: number[];  // Unix timestamps (ms)
  streak: number;
  xpReward: number;
};

/** Pomodoro session */
export type PomodoroSession = {
  mode: PomodoroMode;
  duration: number;        // seconds
  remaining: number;       // seconds
  startedAt?: number;      // Unix timestamp (ms)
  isRunning: boolean;
  completedSessions: number;
};

/** Full game state */
export type GameState = {
  // Player stats
  money: number;
  diamonds: number;
  xp: number;
  level: number;

  // Farm
  plots: LandPlot[];
  selectedTool: ToolType;

  // Inventory
  inventory: Record<CropId, number>;  // Seeds owned
  harvested: Record<CropId, number>;  // Crops harvested

  // Habits
  habits: Habit[];

  // Pomodoro
  pomodoro: PomodoroSession;

  // UI state
  activeModal: 'HABITS' | 'POMODORO' | 'SHOP' | null;
  minimizedPomodoro: boolean;

  // Metadata
  lastSaveTime: number;
  gameVersion: string;
};
```

---

## Zustand Store Architecture

### Core Store

```typescript
// src/stores/gameStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { CROPS, XP_PER_LEVEL, INITIAL_PLOTS } from '@/constants/game';
import type { GameState, CropId, ToolType, Habit, PomodoroMode } from '@/types/game';

const storage = new MMKV({ id: 'pixel-farm-storage' });

/** Zustand storage adapter for MMKV */
const mmkvStorage = {
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
};

type GameStore = GameState & {
  // Player actions
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  addDiamonds: (amount: number) => void;
  spendDiamonds: (amount: number) => boolean;
  addXP: (amount: number) => void;

  // Farm actions
  selectTool: (tool: ToolType) => void;
  plantCrop: (plotId: string, cropId: CropId) => boolean;
  harvestCrop: (plotId: string) => boolean;
  updatePlotProgress: (plotId: string, progress: number) => void;

  // Inventory actions
  addSeed: (cropId: CropId, quantity: number) => void;
  removeSeed: (cropId: CropId, quantity: number) => boolean;
  addHarvest: (cropId: CropId, quantity: number) => void;
  removeHarvest: (cropId: CropId, quantity: number) => boolean;

  // Shop actions
  buySeed: (cropId: CropId, quantity: number) => boolean;
  sellHarvest: (cropId: CropId, quantity: number) => boolean;

  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completionDates' | 'streak'>) => void;
  toggleHabitCompletion: (habitId: string, date: number) => void;
  deleteHabit: (habitId: string) => void;
  updateHabitStreak: (habitId: string) => void;

  // Pomodoro actions
  startPomodoro: (mode: PomodoroMode) => void;
  pausePomodoro: () => void;
  resumePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  completePomodoro: () => void;

  // UI actions
  openModal: (modal: GameState['activeModal']) => void;
  closeModal: () => void;
  toggleMinimizePomodoro: () => void;

  // Utility
  reset: () => void;
  save: () => void;
};

const INITIAL_STATE: GameState = {
  money: 100,
  diamonds: 10,
  xp: 0,
  level: 1,
  plots: INITIAL_PLOTS,
  selectedTool: null,
  inventory: {
    tomato: 5,
    carrot: 5,
    corn: 3,
    watermelon: 1,
  },
  harvested: {
    tomato: 0,
    carrot: 0,
    corn: 0,
    watermelon: 0,
  },
  habits: [],
  pomodoro: {
    mode: 'IDLE',
    duration: 1500,      // 25 minutes
    remaining: 1500,
    isRunning: false,
    completedSessions: 0,
  },
  activeModal: null,
  minimizedPomodoro: false,
  lastSaveTime: Date.now(),
  gameVersion: '1.0.0',
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // Player actions
      addMoney: (amount) =>
        set((state) => ({ money: state.money + amount })),

      spendMoney: (amount) => {
        const { money } = get();
        if (money >= amount) {
          set({ money: money - amount });
          return true;
        }
        return false;
      },

      addDiamonds: (amount) =>
        set((state) => ({ diamonds: state.diamonds + amount })),

      spendDiamonds: (amount) => {
        const { diamonds } = get();
        if (diamonds >= amount) {
          set({ diamonds: diamonds - amount });
          return true;
        }
        return false;
      },

      addXP: (amount) => {
        const { xp, level } = get();
        const newXP = xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

        set({
          xp: newXP,
          level: newLevel,
        });

        // Reward for leveling up
        if (newLevel > level) {
          get().addDiamonds(5);
        }
      },

      // Farm actions
      selectTool: (tool) => set({ selectedTool: tool }),

      plantCrop: (plotId, cropId) => {
        const { plots, inventory, removeSeed } = get();
        const plot = plots.find((p) => p.id === plotId);

        if (!plot || plot.status !== 'EMPTY') return false;
        if (!removeSeed(cropId, 1)) return false;

        set({
          plots: plots.map((p) =>
            p.id === plotId
              ? {
                  ...p,
                  status: 'PLANTED',
                  cropId,
                  plantedAt: Date.now(),
                  progress: 0,
                }
              : p
          ),
        });

        return true;
      },

      harvestCrop: (plotId) => {
        const { plots, addHarvest, addXP } = get();
        const plot = plots.find((p) => p.id === plotId);

        if (!plot || plot.status !== 'READY' || !plot.cropId) return false;

        const crop = CROPS[plot.cropId];
        addHarvest(plot.cropId, 1);
        addXP(crop.xpReward);

        set({
          plots: plots.map((p) =>
            p.id === plotId
              ? {
                  ...p,
                  status: 'EMPTY',
                  cropId: undefined,
                  plantedAt: undefined,
                  progress: 0,
                }
              : p
          ),
        });

        return true;
      },

      updatePlotProgress: (plotId, progress) => {
        set((state) => ({
          plots: state.plots.map((p) =>
            p.id === plotId ? { ...p, progress } : p
          ),
        }));
      },

      // Inventory actions
      addSeed: (cropId, quantity) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            [cropId]: state.inventory[cropId] + quantity,
          },
        }));
      },

      removeSeed: (cropId, quantity) => {
        const { inventory } = get();
        if (inventory[cropId] >= quantity) {
          set({
            inventory: {
              ...inventory,
              [cropId]: inventory[cropId] - quantity,
            },
          });
          return true;
        }
        return false;
      },

      addHarvest: (cropId, quantity) => {
        set((state) => ({
          harvested: {
            ...state.harvested,
            [cropId]: state.harvested[cropId] + quantity,
          },
        }));
      },

      removeHarvest: (cropId, quantity) => {
        const { harvested } = get();
        if (harvested[cropId] >= quantity) {
          set({
            harvested: {
              ...harvested,
              [cropId]: harvested[cropId] - quantity,
            },
          });
          return true;
        }
        return false;
      },

      // Shop actions
      buySeed: (cropId, quantity) => {
        const crop = CROPS[cropId];
        const totalCost = crop.buyPrice * quantity;

        if (get().spendMoney(totalCost)) {
          get().addSeed(cropId, quantity);
          return true;
        }
        return false;
      },

      sellHarvest: (cropId, quantity) => {
        const crop = CROPS[cropId];
        const totalRevenue = crop.sellPrice * quantity;

        if (get().removeHarvest(cropId, quantity)) {
          get().addMoney(totalRevenue);
          return true;
        }
        return false;
      },

      // Habit actions
      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: `habit_${Date.now()}`,
          createdAt: Date.now(),
          completionDates: [],
          streak: 0,
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      toggleHabitCompletion: (habitId, date) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;

            const dateExists = h.completionDates.includes(date);
            const newCompletionDates = dateExists
              ? h.completionDates.filter((d) => d !== date)
              : [...h.completionDates, date];

            return {
              ...h,
              completionDates: newCompletionDates,
            };
          }),
        }));

        get().updateHabitStreak(habitId);
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== habitId),
        }));
      },

      updateHabitStreak: (habitId) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;

            // Calculate streak (consecutive days)
            const sortedDates = [...h.completionDates].sort((a, b) => b - a);
            let streak = 0;
            let currentDate = Date.now();

            for (const date of sortedDates) {
              const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
              if (daysDiff <= 1) {
                streak++;
                currentDate = date;
              } else {
                break;
              }
            }

            return { ...h, streak };
          }),
        }));
      },

      // Pomodoro actions
      startPomodoro: (mode) => {
        const duration = mode === 'FOCUS' ? 1500 : 300; // 25min : 5min

        set({
          pomodoro: {
            mode,
            duration,
            remaining: duration,
            startedAt: Date.now(),
            isRunning: true,
            completedSessions: get().pomodoro.completedSessions,
          },
        });
      },

      pausePomodoro: () => {
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            isRunning: false,
            startedAt: undefined,
          },
        }));
      },

      resumePomodoro: () => {
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            isRunning: true,
            startedAt: Date.now(),
          },
        }));
      },

      resetPomodoro: () => {
        set({
          pomodoro: {
            mode: 'IDLE',
            duration: 1500,
            remaining: 1500,
            isRunning: false,
            completedSessions: get().pomodoro.completedSessions,
          },
        });
      },

      tickPomodoro: () => {
        const { pomodoro } = get();
        if (!pomodoro.isRunning || pomodoro.remaining <= 0) return;

        const newRemaining = pomodoro.remaining - 1;

        if (newRemaining <= 0) {
          get().completePomodoro();
        } else {
          set((state) => ({
            pomodoro: {
              ...state.pomodoro,
              remaining: newRemaining,
            },
          }));
        }
      },

      completePomodoro: () => {
        const { pomodoro, addXP, addMoney } = get();

        // Rewards
        if (pomodoro.mode === 'FOCUS') {
          addXP(50);
          addMoney(25);
        }

        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            isRunning: false,
            remaining: 0,
            completedSessions: state.pomodoro.completedSessions + 1,
          },
        }));
      },

      // UI actions
      openModal: (modal) => set({ activeModal: modal }),
      closeModal: () => set({ activeModal: null }),
      toggleMinimizePomodoro: () =>
        set((state) => ({ minimizedPomodoro: !state.minimizedPomodoro })),

      // Utility
      reset: () => set(INITIAL_STATE),

      save: () => {
        set({ lastSaveTime: Date.now() });
      },
    }),
    {
      name: 'pixel-farm-state',
      storage: createJSONStorage(() => mmkvStorage),
      version: 1,
    }
  )
);
```

---

## Game Loop

### Crop Growth System

```typescript
// src/hooks/useGameLoop.ts
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { CROPS } from '@/constants/game';

export const useGameLoop = () => {
  const plots = useGameStore((state) => state.plots);
  const updatePlotProgress = useGameStore((state) => state.updatePlotProgress);

  useEffect(() => {
    const interval = setInterval(() => {
      plots.forEach((plot) => {
        if (plot.status === 'PLANTED' && plot.cropId && plot.plantedAt) {
          const crop = CROPS[plot.cropId];
          const elapsed = (Date.now() - plot.plantedAt) / 1000; // seconds
          const progress = Math.min(100, (elapsed / crop.growthTime) * 100);

          updatePlotProgress(plot.id, progress);

          // Auto-update status to READY
          if (progress >= 100 && plot.status !== 'READY') {
            useGameStore.setState((state) => ({
              plots: state.plots.map((p) =>
                p.id === plot.id ? { ...p, status: 'READY' } : p
              ),
            }));
          }
        }
      });
    }, 1000); // Tick every 1s

    return () => clearInterval(interval);
  }, [plots, updatePlotProgress]);
};
```

### Pomodoro Timer Loop

```typescript
// src/hooks/usePomodoroLoop.ts
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useGameStore } from '@/stores/gameStore';

export const usePomodoroLoop = () => {
  const pomodoro = useGameStore((state) => state.pomodoro);
  const tickPomodoro = useGameStore((state) => state.tickPomodoro);

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
      if (nextAppState === 'active' && pomodoro.isRunning && pomodoro.startedAt) {
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
          useGameStore.getState().completePomodoro();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [pomodoro]);
};
```

---

## Auto-Save System

```typescript
// src/hooks/useAutoSave.ts
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

export const useAutoSave = () => {
  const save = useGameStore((state) => state.save);

  useEffect(() => {
    const interval = setInterval(() => {
      save();
      console.log('[AutoSave] Game state saved');
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [save]);
};
```

---

## Custom Hooks

### usePlayerStats

```typescript
// src/hooks/usePlayerStats.ts
import { useGameStore } from '@/stores/gameStore';

export const usePlayerStats = () => {
  const money = useGameStore((state) => state.money);
  const diamonds = useGameStore((state) => state.diamonds);
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);

  const addMoney = useGameStore((state) => state.addMoney);
  const spendMoney = useGameStore((state) => state.spendMoney);
  const addDiamonds = useGameStore((state) => state.addDiamonds);
  const addXP = useGameStore((state) => state.addXP);

  return {
    money,
    diamonds,
    xp,
    level,
    addMoney,
    spendMoney,
    addDiamonds,
    addXP,
  };
};
```

### useFarm

```typescript
// src/hooks/useFarm.ts
import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { CropId, ToolType } from '@/types/game';

export const useFarm = () => {
  const plots = useGameStore((state) => state.plots);
  const selectedTool = useGameStore((state) => state.selectedTool);
  const selectTool = useGameStore((state) => state.selectTool);
  const plantCrop = useGameStore((state) => state.plantCrop);
  const harvestCrop = useGameStore((state) => state.harvestCrop);

  const handlePlotClick = useCallback(
    (plotId: string) => {
      const plot = plots.find((p) => p.id === plotId);
      if (!plot) return;

      if (plot.status === 'READY') {
        harvestCrop(plotId);
      } else if (plot.status === 'EMPTY' && selectedTool === 'PLANT') {
        // Show crop selector (handled in UI)
      }
    },
    [plots, selectedTool, harvestCrop]
  );

  return {
    plots,
    selectedTool,
    selectTool,
    plantCrop,
    harvestCrop,
    handlePlotClick,
  };
};
```

---

## Performance Optimizations

### Selector Pattern

```typescript
// BAD: Re-renders on any state change
const gameState = useGameStore();

// GOOD: Only re-renders when money changes
const money = useGameStore((state) => state.money);
```

### Shallow Comparison for Objects

```typescript
import { shallow } from 'zustand/shallow';

// Only re-renders when plots array reference changes
const plots = useGameStore((state) => state.plots, shallow);
```

### Computed Values

```typescript
// src/stores/selectors.ts
import { GameState } from '@/types/game';
import { XP_PER_LEVEL } from '@/constants/game';

export const selectXPProgress = (state: GameState) => {
  const xpInCurrentLevel = state.xp % XP_PER_LEVEL;
  return (xpInCurrentLevel / XP_PER_LEVEL) * 100;
};

export const selectTotalHarvested = (state: GameState) => {
  return Object.values(state.harvested).reduce((sum, count) => sum + count, 0);
};

// Usage
const xpProgress = useGameStore(selectXPProgress);
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/stores/gameStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useGameStore } from '@/stores/gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('adds money correctly', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.addMoney(50);
    });

    expect(result.current.money).toBe(150); // 100 initial + 50
  });

  it('prevents spending more money than available', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      const success = result.current.spendMoney(200);
      expect(success).toBe(false);
    });

    expect(result.current.money).toBe(100); // Unchanged
  });

  it('plants crop and deducts seed from inventory', () => {
    const { result } = renderHook(() => useGameStore());
    const plotId = result.current.plots[0].id;

    act(() => {
      const success = result.current.plantCrop(plotId, 'tomato');
      expect(success).toBe(true);
    });

    expect(result.current.plots[0].status).toBe('PLANTED');
    expect(result.current.plots[0].cropId).toBe('tomato');
    expect(result.current.inventory.tomato).toBe(4); // 5 initial - 1
  });

  it('calculates level from XP correctly', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.addXP(250); // 2.5 levels worth
    });

    expect(result.current.level).toBe(3); // Started at 1
  });
});
```

---

## Migration from Web LocalStorage

```typescript
// src/utils/migration.ts
import { MMKV } from 'react-native-mmkv';
import type { GameState } from '@/types/game';

/**
 * Migrate data from web localStorage format to MMKV
 * (Future use if implementing web-mobile sync)
 */
export const migrateFromWeb = (webData: string): GameState | null => {
  try {
    const parsed = JSON.parse(webData);

    // Validate and transform structure
    const migrated: GameState = {
      money: parsed.money ?? 100,
      diamonds: parsed.gems ?? 10, // Web uses "gems"
      xp: parsed.xp ?? 0,
      level: parsed.level ?? 1,
      plots: parsed.landPlots ?? [],
      selectedTool: null,
      inventory: parsed.seeds ?? {},
      harvested: parsed.harvestedCrops ?? {},
      habits: parsed.habits ?? [],
      pomodoro: {
        mode: 'IDLE',
        duration: 1500,
        remaining: 1500,
        isRunning: false,
        completedSessions: 0,
      },
      activeModal: null,
      minimizedPomodoro: false,
      lastSaveTime: Date.now(),
      gameVersion: '1.0.0',
    };

    return migrated;
  } catch (error) {
    console.error('[Migration] Failed to migrate web data:', error);
    return null;
  }
};
```

---

## Data Validation

```typescript
// src/utils/validation.ts
import type { GameState } from '@/types/game';

export const validateGameState = (state: unknown): state is GameState => {
  if (typeof state !== 'object' || state === null) return false;

  const s = state as Partial<GameState>;

  // Check required fields
  if (typeof s.money !== 'number') return false;
  if (typeof s.diamonds !== 'number') return false;
  if (typeof s.xp !== 'number') return false;
  if (typeof s.level !== 'number') return false;
  if (!Array.isArray(s.plots)) return false;

  // Validate ranges
  if (s.money < 0 || s.diamonds < 0 || s.xp < 0 || s.level < 1) return false;

  return true;
};

export const sanitizeGameState = (state: GameState): GameState => {
  return {
    ...state,
    money: Math.max(0, state.money),
    diamonds: Math.max(0, state.diamonds),
    xp: Math.max(0, state.xp),
    level: Math.max(1, state.level),
  };
};
```

---

## Next Steps

1. ✅ Review this plan
2. ⬜ Install dependencies (`zustand`, `react-native-mmkv`)
3. ⬜ Create type definitions in `src/types/game.ts`
4. ⬜ Create game constants in `src/constants/game.ts`
5. ⬜ Implement Zustand store in `src/stores/gameStore.ts`
6. ⬜ Create custom hooks (`useFarm`, `usePlayerStats`, etc.)
7. ⬜ Implement game loop hooks (`useGameLoop`, `usePomodoroLoop`)
8. ⬜ Write unit tests for store
9. ⬜ Proceed to Plan 03: Component Architecture

---

## References

- Zustand docs: https://github.com/pmndrs/zustand
- MMKV docs: https://github.com/mrousavy/react-native-mmkv
- Web state logic: [src/web/App.tsx](../src/web/App.tsx)
