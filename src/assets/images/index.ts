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

// Export all images
export const images = {
  farm: farmImages,
} as const;
