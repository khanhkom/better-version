import React from 'react';
import Box from './Box';
import Text from './Text';
import type { Theme } from '@/theme/restyle';

type ProgressBarVariant = 'yellow' | 'pink';

interface ProgressBarProps {
  current: number;
  max: number;
  variant?: ProgressBarVariant;
  label?: string;
  icon?: React.ReactNode;
  caption?: string;
}

const variantConfig: Record<
  ProgressBarVariant,
  {
    bgColor: keyof Theme['colors'];
    fillColor: keyof Theme['colors'];
  }
> = {
  yellow: {
    bgColor: 'progressBgYellow',
    fillColor: 'progressYellow',
  },
  pink: {
    bgColor: 'progressBgPink',
    fillColor: 'progressPink',
  },
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  variant = 'yellow',
  label,
  icon,
  caption,
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  const config = variantConfig[variant];

  return (
    <Box>
      {label && (
        <Box flexDirection="row" alignItems="center" marginBottom="s">
          {icon && <Box marginRight="s">{icon}</Box>}
          <Text variant="label" color={config.fillColor}>
            {label}
          </Text>
          <Box flex={1} />
          <Text variant="title" color={config.fillColor}>
            {current}/{max}
          </Text>
        </Box>
      )}

      <Box
        height={16}
        backgroundColor={config.bgColor}
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          height="100%"
          width={`${percentage}%`}
          backgroundColor={config.fillColor}
          borderRadius="full"
        />
      </Box>

      {caption && (
        <Box marginTop="xs">
          <Text variant="caption" color="textSecondary">
            {caption}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ProgressBar;
