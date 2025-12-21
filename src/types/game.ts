/**
 * Game Type Definitions
 * Type-safe definitions for Pixel Farm game state
 */

/** Crop identifiers */
export type CropId = 'carrot' | 'corn' | 'tomato' | 'watermelon';

/** Plot status states */
export type PlotStatus = 'EMPTY' | 'PLANTED' | 'READY';

/** Tool types */
export type ToolType = 'DIG' | 'PLANT' | 'WATER' | null;

/** Pomodoro mode */
export type PomodoroMode = 'BREAK' | 'FOCUS' | 'IDLE';

/** Habit frequency */
export type HabitFrequency = 'daily' | 'weekly';

/** Crop configuration */
export type Crop = {
  buyPrice: number;
  growthTime: number; // seconds
  icon: string;
  id: CropId;
  name: string;
  sellPrice: number;
  xpReward: number;
};

/** Land plot */
export type LandPlot = {
  cropId?: CropId;
  id: string;
  plantedAt?: number; // Unix timestamp (ms)
  progress: number; // 0-100
  status: PlotStatus;
};

/** Habit difficulty level */
export type HabitDifficulty = 'easy' | 'hard' | 'medium';

/** Habit item */
export type Habit = {
  completionDates: number[]; // Unix timestamps (ms)
  createdAt: number;
  description?: string;
  difficulty: HabitDifficulty;
  frequency: HabitFrequency;
  icon?: string; // Icon identifier or emoji
  id: string;
  moneyReward: number;
  reminderTime?: string; // Time in HH:mm format
  streak: number;
  title: string;
  xpReward: number;
};

/** Pomodoro session */
export type PomodoroSession = {
  completedSessions: number;
  duration: number; // seconds
  isRunning: boolean;
  mode: PomodoroMode;
  remaining: number; // seconds
  startedAt?: number; // Unix timestamp (ms)
};

/** Full game state */
export type GameState = {
  // Player stats
  diamonds: number;
  level: number;
  money: number;
  xp: number;

  // Farm
  plots: LandPlot[];
  selectedTool: ToolType;

  // Inventory
  harvested: Record<CropId, number>; // Crops harvested
  inventory: Record<CropId, number>; // Seeds owned

  // Habits
  habits: Habit[];

  // Pomodoro
  pomodoro: PomodoroSession;

  // UI state
  activeModal: 'HABITS' | 'POMODORO' | 'SHOP' | null;
  minimizedPomodoro: boolean;

  // Metadata
  gameVersion: string;
  lastSaveTime: number;
};
