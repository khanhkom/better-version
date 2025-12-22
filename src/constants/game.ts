/**
 * Game Constants
 * Configuration for Pixel Farm game
 */

import type { Crop, CropId, LandPlot } from '@/types/game';

import { cropImages } from '@/assets/images';

const SECONDS_PER_MINUTE = 60;

const CROP_GROWTH_MINUTES = {
  carrot: 5,
  corn: 10,
  tomato: 3,
  watermelon: 15,
} as const;

/** Crop configurations */
export const CROPS: Record<CropId, Crop> = {
  carrot: {
    buyPrice: 15,
    growthTime: CROP_GROWTH_MINUTES.carrot * SECONDS_PER_MINUTE, // 5 phút
    icon: '🥕',
    id: 'carrot',
    name: 'Cà rốt',
    sellPrice: 35,
    stages: cropImages.carrot.map((image, index) => ({
      image,
      stageNumber: index + 1,
    })),
    xpReward: 20,
  },
  corn: {
    buyPrice: 25,
    growthTime: CROP_GROWTH_MINUTES.corn * SECONDS_PER_MINUTE, // 10 phút
    icon: '🌽',
    id: 'corn',
    name: 'Ngô',
    sellPrice: 60,
    stages: cropImages.corn.map((image, index) => ({
      image,
      stageNumber: index + 1,
    })),
    xpReward: 30,
  },
  tomato: {
    buyPrice: 10,
    growthTime: CROP_GROWTH_MINUTES.tomato * SECONDS_PER_MINUTE, // 3 phút
    icon: '🍅',
    id: 'tomato',
    name: 'Cà chua',
    sellPrice: 25,
    stages: cropImages.tomato.map((image, index) => ({
      image,
      stageNumber: index + 1,
    })),
    xpReward: 15,
  },
  watermelon: {
    buyPrice: 40,
    growthTime: CROP_GROWTH_MINUTES.watermelon * SECONDS_PER_MINUTE, // 15 phút
    icon: '🍉',
    id: 'watermelon',
    name: 'Dưa hấu',
    sellPrice: 100,
    stages: cropImages.watermelon.map((image, index) => ({
      image,
      stageNumber: index + 1,
    })),
    xpReward: 50,
  },
};

/** Game loop tick rate (milliseconds) */
export const TICK_RATE = 1000; // 1 second

/** XP required per level */
export const XP_PER_LEVEL = 100;

/** Initial number of plots */
export const INITIAL_PLOTS_COUNT = 6;

/** Plot purchase base cost */
export const PLOT_BASE_COST = 10;

/** Generate initial plots */
export const INITIAL_PLOTS: LandPlot[] = Array.from(
  { length: INITIAL_PLOTS_COUNT },
  (_, index) => ({
    id: `plot_${index}`,
    progress: 0,
    status: 'EMPTY',
  }),
);

/** Auto-save interval (milliseconds) */
export const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

/** Pomodoro durations (seconds) */
export const POMODORO_DURATIONS = {
  BREAK: 300, // 5 minutes
  FOCUS: 1500, // 25 minutes
} as const;

/** Pomodoro rewards */
export const POMODORO_REWARDS = {
  BREAK: {
    money: 5,
    xp: 10,
  },
  FOCUS: {
    money: 25,
    xp: 50,
  },
} as const;

/** Habit XP reward */
export const HABIT_XP_REWARD = 20;

/** Initial player stats */
export const INITIAL_PLAYER_STATS = {
  diamonds: 10,
  level: 1,
  money: 100,
  xp: 0,
} as const;

/** Initial inventory */
export const INITIAL_INVENTORY = {
  carrot: 5,
  corn: 3,
  tomato: 5,
  watermelon: 1,
} as const;
