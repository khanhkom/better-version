import React from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
import Box from './Box';
import type { Theme } from '@/theme/restyle';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  source: ImageSourcePropType;
  size?: AvatarSize;
  borderColor?: keyof Theme['colors'];
}

const sizeMap: Record<AvatarSize, number> = {
  small: 40,
  medium: 60,
  large: 100,
};

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  borderColor = 'borderPrimary',
}) => {
  const avatarSize = sizeMap[size];

  return (
    <Box
      width={avatarSize}
      height={avatarSize}
      borderRadius="l"
      borderWidth={2}
      borderColor={borderColor}
      overflow="hidden"
    >
      <Image
        source={source}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </Box>
  );
};

export default Avatar;
