
import { Crop, Habit, HabitDifficulty } from './types';

export const DIFFICULTY_SETTINGS: Record<HabitDifficulty, { label: string, xuMult: number, xpMult: number, color: string }> = {
  EASY: { label: 'Dễ', xuMult: 1, xpMult: 1, color: 'text-green-600' },
  MEDIUM: { label: 'Vừa', xuMult: 2, xpMult: 2, color: 'text-orange-600' },
  HARD: { label: 'Khó', xuMult: 4, xpMult: 4, color: 'text-red-600' }
};

export const CROPS: Record<string, Crop> = {
  tomato: {
    id: 'tomato',
    name: 'Cà chua',
    icon: '🍅',
    growthTime: 14400, // 4 hours in seconds
    buyPrice: 10,
    diamondPrice: 1,
    sellPrice: 25,
    yield: 25,
    color: 'bg-red-500',
    minLevel: 1
  },
  carrot: {
    id: 'carrot',
    name: 'Cà rốt',
    icon: '🥕',
    growthTime: 10,
    buyPrice: 15,
    diamondPrice: 1,
    sellPrice: 35,
    yield: 20,
    color: 'bg-orange-500',
    minLevel: 1
  },
  corn: {
    id: 'corn',
    name: 'Ngô',
    icon: '🌽',
    growthTime: 20,
    buyPrice: 25,
    diamondPrice: 2,
    sellPrice: 65,
    yield: 15,
    color: 'bg-yellow-400',
    minLevel: 2
  },
  watermelon: {
    id: 'watermelon',
    name: 'Dưa hấu',
    icon: '🍉',
    growthTime: 3600,
    buyPrice: 50,
    diamondPrice: 4,
    sellPrice: 150,
    yield: 10,
    color: 'bg-green-600',
    minLevel: 3
  },
  grapes: {
    id: 'grapes',
    name: 'Nho',
    icon: '🍇',
    growthTime: 7200,
    buyPrice: 80,
    diamondPrice: 6,
    sellPrice: 240,
    yield: 30,
    color: 'bg-purple-500',
    minLevel: 4
  },
  rose: {
    id: 'rose',
    name: 'Hoa hồng',
    icon: '🌹',
    growthTime: 10800,
    buyPrice: 120,
    diamondPrice: 10,
    sellPrice: 400,
    yield: 5,
    color: 'bg-pink-500',
    minLevel: 5
  },
  strawberry: {
    id: 'strawberry',
    name: 'Dâu tây',
    icon: '🍓',
    growthTime: 60,
    buyPrice: 100,
    diamondPrice: 8,
    sellPrice: 350,
    yield: 40,
    color: 'bg-pink-500',
    minLevel: 5
  },
  chili: {
    id: 'chili',
    name: 'Ớt',
    icon: '🌶️',
    growthTime: 500,
    buyPrice: 20,
    diamondPrice: 2,
    sellPrice: 60,
    yield: 50,
    color: 'bg-red-700',
    minLevel: 2
  }
};

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', name: 'Đọc sách 30p', icon: '📚', difficulty: 'MEDIUM', xuReward: 20, xpReward: 30, completionHistory: [] },
  { id: 'h2', name: 'Tập thể dục', icon: '🏋️', difficulty: 'HARD', xuReward: 40, xpReward: 60, completionHistory: [] },
  { id: 'h3', name: 'Uống đủ nước', icon: '💧', difficulty: 'EASY', xuReward: 10, xpReward: 15, completionHistory: [] }
];

export const INITIAL_PLOTS_COUNT = 6;
export const PLOT_UPGRADE_COST = 500;
export const TICK_RATE = 1000;
export const XP_PER_LEVEL = 100;
export const DIAMONDS_PER_HARVEST = 1;
