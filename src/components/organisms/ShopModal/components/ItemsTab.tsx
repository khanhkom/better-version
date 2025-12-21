/**
 * ItemsTab Component
 * Items shop tab (coming soon)
 */

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

export function ItemsTab() {
  return (
    <Box alignItems="center" padding="l">
      <Text color="textSecondary" fontSize={14} textAlign="center">
        🛠️ Coming soon...
      </Text>
      <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
        Tools and upgrades will be available here
      </Text>
    </Box>
  );
}
