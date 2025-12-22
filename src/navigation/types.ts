import type { Paths } from '@/navigation/paths';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';

export type MainTabParamList = {
  [Paths.FarmGame]: undefined;
  [Paths.Habits]: undefined;
  [Paths.Statistics]: undefined;
};

export type MainTabScreenProps<
  S extends keyof MainTabParamList = keyof MainTabParamList,
> = BottomTabScreenProps<MainTabParamList, S>;

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Example]: undefined;
  [Paths.MainTabs]: undefined;
  [Paths.ProfileExample]: undefined;
  [Paths.Startup]: undefined;
};
