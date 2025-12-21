import React from 'react';
import Box from '../atoms/Box';
import Text from '../atoms/Text';
import type { Theme } from '@/theme/restyle';

type StatCardVariant = 'gold' | 'blue' | 'orange';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: StatCardVariant;
  borderColor?: keyof Theme['colors'];
}

const variantConfig: Record<
  StatCardVariant,
  {
    iconBgColor: keyof Theme['colors'];
    iconColor: keyof Theme['colors'];
  }
> = {
  gold: {
    iconBgColor: 'iconBgGold',
    iconColor: 'secondary',
  },
  blue: {
    iconBgColor: 'iconBgBlue',
    iconColor: 'primary',
  },
  orange: {
    iconBgColor: 'iconBgOrange',
    iconColor: 'warning',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  variant = 'gold',
  borderColor = 'borderPrimary',
}) => {
  const config = variantConfig[variant];

  return (
    <Box
      backgroundColor="cardPrimaryBackground"
      borderRadius="l"
      borderWidth={2}
      borderColor={borderColor}
      padding="l"
      alignItems="center"
      minWidth={100}
    >
      <Box
        backgroundColor={config.iconBgColor}
        borderRadius="full"
        width={48}
        height={48}
        alignItems="center"
        justifyContent="center"
        marginBottom="m"
      >
        {icon}
      </Box>

      <Text variant="stat" marginBottom="xs">
        {value}
      </Text>

      <Text variant="label" color={config.iconColor}>
        {label}
      </Text>
    </Box>
  );
};

export default StatCard;
