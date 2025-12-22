/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

// Crop growth stage images
export const cropImages: Record<
  'carrot' | 'corn' | 'tomato' | 'watermelon',
  ImageSourcePropType[]
> = {
  carrot: [
    require('./farm/carrot/frame_1.png'),
    require('./farm/carrot/frame_2.png'),
    require('./farm/carrot/frame_3.png'),
    require('./farm/carrot/frame_4.png'),
    require('./farm/carrot/frame_5.png'),
    require('./farm/carrot/frame_6.png'),
    require('./farm/carrot/frame_7.png'),
    require('./farm/carrot/frame_8.png'),
    require('./farm/carrot/frame_9.png'),
  ],
  corn: [
    require('./farm/corn/frame_1.png'),
    require('./farm/corn/frame_2.png'),
    require('./farm/corn/frame_3.png'),
    require('./farm/corn/frame_4.png'),
    require('./farm/corn/frame_5.png'),
    require('./farm/corn/frame_6.png'),
    require('./farm/corn/frame_7.png'),
    require('./farm/corn/frame_8.png'),
    require('./farm/corn/frame_9.png'),
    require('./farm/corn/frame_10.png'),
  ],
  tomato: [
    require('./farm/tomato/frame_1.png'),
    require('./farm/tomato/frame_2.png'),
    require('./farm/tomato/frame_3.png'),
    require('./farm/tomato/frame_4.png'),
    require('./farm/tomato/frame_5.png'),
    require('./farm/tomato/frame_6.png'),
  ],
  watermelon: [
    require('./farm/watermelon/frame_1.png'),
    require('./farm/watermelon/frame_2.png'),
    require('./farm/watermelon/frame_3.png'),
    require('./farm/watermelon/frame_4.png'),
    require('./farm/watermelon/frame_5.png'),
    require('./farm/watermelon/frame_6.png'),
    require('./farm/watermelon/frame_7.png'),
  ],
};

// Home images
export const homeImages = {
  icFarm: require('./home/ic_farm.png') as ImageSourcePropType,
  icHome: require('./home/ic_home.png') as ImageSourcePropType,
  icMission: require('./home/ic_mission.png') as ImageSourcePropType,
  icStatistic: require('./home/ic_statistic.png') as ImageSourcePropType,
} as const;

// Export all images
export const images = {
  crops: cropImages,
  farm: farmImages,
  home: homeImages,
} as const;
