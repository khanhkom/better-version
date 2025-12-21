/**
 * Game Store
 * Zustand store with MMKV persistence for Pixel Farm game state
 */

import type {
  CropId,
  GameState,
  Habit,
  HabitFrequency,
  PomodoroMode,
  ToolType,
} from '@/types/game';

import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  CROPS,
  HABIT_XP_REWARD,
  INITIAL_INVENTORY,
  INITIAL_PLAYER_STATS,
  INITIAL_PLOTS,
  POMODORO_DURATIONS,
  POMODORO_REWARDS,
  XP_PER_LEVEL,
} from '@/constants/game';

/** MMKV storage instance */
const storage = new MMKV({ id: 'pixel-farm-storage' });

/** MMKV storage adapter for Zustand */
const mmkvStorage = {
  getItem: (key: string): null | string => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
};

/** Game store with all actions */
type GameStore = {
  // Player actions
  addDiamonds: (amount: number) => void;
  addMoney: (amount: number) => void;
  addXP: (amount: number) => void;
  spendDiamonds: (amount: number) => boolean;
  spendMoney: (amount: number) => boolean;

  // Farm actions
  harvestCrop: (plotId: string) => boolean;
  plantCrop: (plotId: string, cropId: CropId) => boolean;
  selectTool: (tool: ToolType) => void;
  updatePlotProgress: (plotId: string, progress: number) => void;

  // Inventory actions
  addHarvest: (cropId: CropId, quantity: number) => void;
  addSeed: (cropId: CropId, quantity: number) => void;
  removeHarvest: (cropId: CropId, quantity: number) => boolean;
  removeSeed: (cropId: CropId, quantity: number) => boolean;

  // Shop actions
  buySeed: (cropId: CropId, quantity: number) => boolean;
  sellHarvest: (cropId: CropId, quantity: number) => boolean;

  // Habit actions
  addHabit: (
    habit: Omit<Habit, 'completionDates' | 'createdAt' | 'id' | 'streak'>,
  ) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string, date: number) => void;
  updateHabit: (
    habitId: string,
    updates: Partial<Omit<Habit, 'completionDates' | 'createdAt' | 'id' | 'streak'>>,
  ) => void;
  updateHabitStreak: (habitId: string) => void;

  // Pomodoro actions
  completePomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  resumePomodoro: () => void;
  startPomodoro: (mode: PomodoroMode) => void;
  tickPomodoro: () => void;

  // UI actions
  closeModal: () => void;
  openModal: (modal: GameState['activeModal']) => void;
  toggleMinimizePomodoro: () => void;

  // Utility
  reset: () => void;
  save: () => void;
} & GameState;

/** Initial game state */
const INITIAL_STATE: GameState = {
  ...INITIAL_PLAYER_STATS,
  activeModal: null,
  gameVersion: '1.0.0',
  habits: [],
  harvested: {
    carrot: 0,
    corn: 0,
    tomato: 0,
    watermelon: 0,
  },
  inventory: INITIAL_INVENTORY,
  lastSaveTime: Date.now(),
  minimizedPomodoro: false,
  plots: INITIAL_PLOTS,
  pomodoro: {
    completedSessions: 0,
    duration: POMODORO_DURATIONS.FOCUS,
    isRunning: false,
    mode: 'IDLE',
    remaining: POMODORO_DURATIONS.FOCUS,
  },
  selectedTool: null,
};

/** Game store */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // Player actions
      addDiamonds: (amount) =>
        set((state) => ({ diamonds: state.diamonds + amount })),

      addMoney: (amount) => set((state) => ({ money: state.money + amount })),

      addXP: (amount) => {
        const { level, xp } = get();
        const newXP = xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

        set({
          level: newLevel,
          xp: newXP,
        });

        // Reward for leveling up
        if (newLevel > level) {
          get().addDiamonds(5);
        }
      },

      spendDiamonds: (amount) => {
        const { diamonds } = get();
        if (diamonds >= amount) {
          set({ diamonds: diamonds - amount });
          return true;
        }
        return false;
      },

      spendMoney: (amount) => {
        const { money } = get();
        if (money >= amount) {
          set({ money: money - amount });
          return true;
        }
        return false;
      },

      // Farm actions
      harvestCrop: (plotId) => {
        const { addHarvest, addXP, plots } = get();
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
                  cropId: undefined,
                  plantedAt: undefined,
                  progress: 0,
                  status: 'EMPTY' as const,
                }
              : p,
          ),
        });

        return true;
      },

      plantCrop: (plotId, cropId) => {
        const { plots, removeSeed } = get();
        const plot = plots.find((p) => p.id === plotId);

        if (!plot || plot.status !== 'EMPTY') return false;
        if (!removeSeed(cropId, 1)) return false;

        set({
          plots: plots.map((p) =>
            p.id === plotId
              ? {
                  ...p,
                  cropId,
                  plantedAt: Date.now(),
                  progress: 0,
                  status: 'PLANTED' as const,
                }
              : p,
          ),
        });

        return true;
      },

      selectTool: (tool) => set({ selectedTool: tool }),

      updatePlotProgress: (plotId, progress) => {
        set((state) => ({
          plots: state.plots.map((p) =>
            p.id === plotId ? { ...p, progress } : p,
          ),
        }));
      },

      // Inventory actions
      addHarvest: (cropId, quantity) => {
        set((state) => ({
          harvested: {
            ...state.harvested,
            [cropId]: state.harvested[cropId] + quantity,
          },
        }));
      },

      addSeed: (cropId, quantity) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            [cropId]: state.inventory[cropId] + quantity,
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
        // Calculate money reward based on difficulty
        const moneyRewards = {
          easy: 10,
          hard: 40,
          medium: 20,
        };
        const xpRewards = {
          easy: 15,
          hard: 60,
          medium: 30,
        };

        const difficulty = habit.difficulty ?? 'medium';
        const newHabit: Habit = {
          ...habit,
          completionDates: [],
          createdAt: Date.now(),
          difficulty,
          id: `habit_${Date.now()}`,
          moneyReward: moneyRewards[difficulty],
          streak: 0,
          xpReward: habit.xpReward ?? xpRewards[difficulty],
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== habitId),
        }));
      },

      updateHabit: (habitId, updates) => {
        // Calculate rewards if difficulty changed
        const moneyRewards = {
          easy: 10,
          hard: 40,
          medium: 20,
        };
        const xpRewards = {
          easy: 15,
          hard: 60,
          medium: 30,
        };

        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== habitId) return h;

            const newDifficulty = updates.difficulty ?? h.difficulty;
            return {
              ...h,
              ...updates,
              difficulty: newDifficulty,
              moneyReward: updates.difficulty
                ? moneyRewards[newDifficulty]
                : h.moneyReward,
              xpReward: updates.difficulty
                ? xpRewards[newDifficulty]
                : h.xpReward,
            };
          }),
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

        // Award XP if completing (not uncompleting)
        const habit = get().habits.find((h) => h.id === habitId);
        if (habit?.completionDates.includes(date)) {
          get().addXP(habit.xpReward);
        }
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
              const daysDiff = Math.floor(
                (currentDate - date) / (1000 * 60 * 60 * 24),
              );
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
      completePomodoro: () => {
        const { addMoney, addXP, pomodoro } = get();

        // Rewards
        if (pomodoro.mode === 'FOCUS') {
          addXP(POMODORO_REWARDS.FOCUS.xp);
          addMoney(POMODORO_REWARDS.FOCUS.money);
        } else if (pomodoro.mode === 'BREAK') {
          addXP(POMODORO_REWARDS.BREAK.xp);
          addMoney(POMODORO_REWARDS.BREAK.money);
        }

        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            completedSessions: state.pomodoro.completedSessions + 1,
            isRunning: false,
            remaining: 0,
          },
        }));
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

      resetPomodoro: () => {
        set({
          pomodoro: {
            completedSessions: get().pomodoro.completedSessions,
            duration: POMODORO_DURATIONS.FOCUS,
            isRunning: false,
            mode: 'IDLE',
            remaining: POMODORO_DURATIONS.FOCUS,
          },
        });
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

      startPomodoro: (mode) => {
        const duration =
          mode === 'FOCUS'
            ? POMODORO_DURATIONS.FOCUS
            : POMODORO_DURATIONS.BREAK;

        set({
          pomodoro: {
            completedSessions: get().pomodoro.completedSessions,
            duration,
            isRunning: true,
            mode,
            remaining: duration,
            startedAt: Date.now(),
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

      // UI actions
      closeModal: () => set({ activeModal: null }),
      openModal: (modal) => set({ activeModal: modal }),
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
    },
  ),
);
