
export interface Crop {
  id: string;
  name: string;
  icon: string;
  growthTime: number; // in seconds
  buyPrice: number;
  diamondPrice: number;
  sellPrice: number;
  yield: number;
  color: string;
  minLevel: number;
}

export enum PlotStatus {
  EMPTY = 'EMPTY',
  PLANTED = 'PLANTED',
  READY = 'READY'
}

export interface LandPlot {
  id: string;
  status: PlotStatus;
  cropId?: string;
  plantedAt?: number;
  progress: number;
}

export type HabitDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  difficulty: HabitDifficulty;
  time?: string;
  xuReward: number;
  xpReward: number;
  completedAt?: number;
  completionHistory: number[];
}

export type FocusMode = 'FOCUS' | 'BREAK';

export interface FocusState {
  isActive: boolean;
  mode: FocusMode;
  timeLeft: number;
  totalTime: number;
}

export interface GameState {
  money: number;
  diamonds: number;
  xp: number;
  level: number;
  inventory: Record<string, number>;
  harvested: Record<string, number>;
  plots: LandPlot[];
  habits: Habit[];
}
