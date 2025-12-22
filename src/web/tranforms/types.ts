
export type Weather = 'sunny' | 'rainy' | 'snowy' | 'night';

export interface Habit {
  id: string;
  title: string;
  energyReward: number;
  completed: boolean;
  icon: string;
}

export interface AppState {
  habits: Habit[];
  petName: string;
  energy: number;
  adventureProgress: number;
  adventureTimeLeft: string;
  weather: Weather;
}
