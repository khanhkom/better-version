/**
 * Image Assets
 * Centralized export of all image assets
 */

import type { ImageSourcePropType } from 'react-native';

// Farm images
export const farmImages = {
  backgroundFarm: require('./farm/background_farm.png') as ImageSourcePropType,
  oDat: require('./farm/o_dat.png') as ImageSourcePropType,
} as const;

// Home images
export const homeImages = {
  icFarm: require('./home/ic_farm.png') as ImageSourcePropType,
  icHome: require('./home/ic_home.png') as ImageSourcePropType,
  icMission: require('./home/ic_mission.png') as ImageSourcePropType,
} as const;

// Export all images
export const images = {
  farm: farmImages,
  home: homeImages,
} as const;
