/**
 * PomodoroControls Component
 * Control buttons for pomodoro timer
 */

import type { PomodoroMode } from '@/types/game';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';

type PomodoroControlsProps = {
  readonly isRunning: boolean;
  readonly mode: PomodoroMode;
  readonly onPause: () => void;
  readonly onReset: () => void;
  readonly onResume: () => void;
  readonly onStart: (mode: 'FOCUS') => void;
};

export function PomodoroControls({
  isRunning,
  mode,
  onPause,
  onReset,
  onResume,
  onStart,
}: PomodoroControlsProps) {
  if (mode === 'IDLE') {
    return (
      <Box flexDirection="row" gap="m">
        <Box flex={1}>
          <Button
            backgroundColor="focusRed"
            borderColor="farmBorder"
            borderRadius="m"
            borderWidth={2}
            onPress={() => { onStart('FOCUS'); }}
            paddingVertical="l"
            textColor="textPrimary"
            title="🍅 Bắt Đầu Tập Trung"
          />
        </Box>
      </Box>
    );
  }

  const handleToggle = () => {
    if (isRunning) {
      onPause();
    } else {
      onResume();
    }
  };

  return (
    <Box flexDirection="row" gap="m">
      <Box flex={1}>
        <Button
          backgroundColor={isRunning ? 'highlightYellow' : 'success'}
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={2}
          onPress={handleToggle}
          paddingVertical="l"
          textColor="textPrimary"
          title={isRunning ? '⏸️ Tạm Dừng' : '▶️ Tiếp Tục'}
        />
      </Box>
      <Box width={120}>
        <Button
          backgroundColor="danger"
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={2}
          onPress={onReset}
          paddingVertical="l"
          textColor="textPrimary"
          title="🔄 Reset"
        />
      </Box>
    </Box>
  );
}
