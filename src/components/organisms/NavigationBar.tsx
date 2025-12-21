/**
 * NavigationBar Component
 * Bottom navigation for accessing modals (Habits, Pomodoro, Shop)
 */

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';

type NavigationBarProps = {
  readonly onHabitsPress: () => void;
  readonly onPomodoroPress: () => void;
  readonly onShopPress: () => void;
};

export function NavigationBar({
  onHabitsPress,
  onPomodoroPress,
  onShopPress,
}: NavigationBarProps) {
  return (
    <Box backgroundColor="farmBorderDark" flexDirection="row" gap="s" padding="m">
      <Box flex={1}>
        <Button
          backgroundColor="farmCardBgLight"
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={2}
          onPress={onHabitsPress}
          paddingVertical="m"
          textColor="textPrimary"
          title="📋 Nhiệm Vụ"
        />
      </Box>

      <Box flex={1}>
        <Button
          backgroundColor="farmCardBgLight"
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={2}
          onPress={onPomodoroPress}
          paddingVertical="m"
          textColor="textPrimary"
          title="🍅 Tập Trung"
        />
      </Box>

      <Box flex={1}>
        <Button
          backgroundColor="farmCardBgLight"
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={2}
          onPress={onShopPress}
          paddingVertical="m"
          textColor="textPrimary"
          title="🏪 Cửa hàng"
        />
      </Box>
    </Box>
  );
}
