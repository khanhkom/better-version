/**
 * MoneyDisplay Component
 * Display player's current money
 */

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

type MoneyDisplayProps = {
  readonly money: number;
};

export function MoneyDisplay({ money }: MoneyDisplayProps) {
  return (
    <Box
      alignItems="center"
      backgroundColor="farmCardBgLight"
      borderRadius="m"
      flexDirection="row"
      gap="m"
      justifyContent="center"
      mb="m"
      padding="m"
    >
      <Text fontSize={14} fontWeight="700">
        💰 {money}
      </Text>
    </Box>
  );
}
