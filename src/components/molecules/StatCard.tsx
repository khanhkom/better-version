import type { Theme } from '@/theme/restyle';

import React from 'react';

import Box from '../atoms/Box';
import Text from '../atoms/Text';

type StatCardProps = {
  readonly borderColor?: keyof Theme['colors'];
  readonly icon: React.ReactNode;
  readonly label?: string;
  readonly value: number | string;
  readonly variant?: StatCardVariant;
};

type StatCardVariant = 'blue' | 'gold' | 'orange';

const variantConfig: Record<
  StatCardVariant,
  {
    iconBgColor: keyof Theme['colors'];
    iconColor: keyof Theme['colors'];
  }
> = {
  blue: {
    iconBgColor: 'iconBgBlue',
    iconColor: 'primary',
  },
  gold: {
    iconBgColor: 'iconBgGold',
    iconColor: 'secondary',
  },
  orange: {
    iconBgColor: 'iconBgOrange',
    iconColor: 'warning',
  },
};

function StatCard({
  borderColor = 'borderPrimary',
  icon,
  label = undefined,
  value,
  variant = 'gold',
}: StatCardProps) {
  const config = variantConfig[variant];

  // Compact horizontal layout: icon left, value right
  if (!label) {
    return (
      <Box
        alignItems="center"
        backgroundColor="cardPrimaryBackground"
        borderColor={borderColor}
        borderRadius="m"
        borderWidth={2}
        flexDirection="row"
        gap="s"
        padding="s"
      >
        <Box
          alignItems="center"
          backgroundColor={config.iconBgColor}
          borderRadius="s"
          height={32}
          justifyContent="center"
          width={32}
        >
          <Text fontSize={18}>{icon}</Text>
        </Box>
        <Text color={config.iconColor} fontSize={14} fontWeight="700" variant="stat">
          {value}
        </Text>
      </Box>
    );
  }

  // Original vertical layout with label (for backward compatibility)
  return (
    <Box
      alignItems="center"
      backgroundColor="cardPrimaryBackground"
      borderColor={borderColor}
      borderRadius="l"
      borderWidth={2}
      minWidth={100}
      padding="l"
    >
      <Box
        alignItems="center"
        backgroundColor={config.iconBgColor}
        borderRadius="full"
        height={48}
        justifyContent="center"
        marginBottom="m"
        width={48}
      >
        {icon}
      </Box>

      <Text marginBottom="xs" variant="stat">
        {value}
      </Text>

      <Text color={config.iconColor} variant="label">
        {label}
      </Text>
    </Box>
  );
}

export default StatCard;
