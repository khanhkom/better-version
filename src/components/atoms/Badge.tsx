import React from 'react';
import Box from './Box';
import Text from './Text';
import type { Theme } from '@/theme/restyle';

interface BadgeProps {
  count: number;
  backgroundColor?: keyof Theme['colors'];
  textColor?: keyof Theme['colors'];
  size?: number;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  backgroundColor = 'danger',
  textColor = 'white',
  size = 24,
}) => {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <Box
      backgroundColor={backgroundColor}
      borderRadius="full"
      minWidth={size}
      height={size}
      paddingHorizontal="xs"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        variant="caption"
        color={textColor}
        fontSize={10}
        fontWeight="700"
      >
        {displayCount}
      </Text>
    </Box>
  );
};

export default Badge;
