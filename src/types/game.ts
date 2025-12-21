/**
 * Game Type Definitions
 * Type-safe definitions for Pixel Farm game state
 */

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
  growthTime: number; // seconds
  buyPrice: number;
  sellPrice: number;
  xpReward: number;
};

/** Land plot */
export type LandPlot = {
  id: string;
  status: PlotStatus;
  cropId?: CropId;
  plantedAt?: number; // Unix timestamp (ms)
  progress: number; // 0-100
};

/** Habit item */
export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  createdAt: number;
  completionDates: number[]; // Unix timestamps (ms)
  streak: number;
  xpReward: number;
};

/** Pomodoro session */
export type PomodoroSession = {
  mode: PomodoroMode;
  duration: number; // seconds
  remaining: number; // seconds
  startedAt?: number; // Unix timestamp (ms)
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
  inventory: Record<CropId, number>; // Seeds owned
  harvested: Record<CropId, number>; // Crops harvested

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
