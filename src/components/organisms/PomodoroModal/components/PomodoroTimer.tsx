/**
 * PomodoroTimer Component
 * Circular progress timer display
 */

import type { PomodoroMode } from '@/types/game';
import type { Theme } from '@/theme/restyle';

import Box from '@/components/atoms/Box';
import { CircularProgress } from '@/components/atoms/CircularProgress';
import Text from '@/components/atoms/Text';

import { POMODORO_DURATIONS } from '@/constants/game';

const SECONDS_PER_MINUTE = 60;
const MAX_PERCENTAGE = 100;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
  const secs = seconds % SECONDS_PER_MINUTE;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

type PomodoroTimerProps = {
  readonly color: keyof Theme['colors'];
  readonly mode: PomodoroMode;
  readonly remaining: number;
};

export function PomodoroTimer({ color, mode, remaining }: PomodoroTimerProps) {
  const getProgress = () => {
    if (mode === 'IDLE') return 0;
    const totalDuration = POMODORO_DURATIONS[mode];
    return ((totalDuration - remaining) / totalDuration) * MAX_PERCENTAGE;
  };

  return (
    <Box alignItems="center" mb="l">
      <Box position="relative">
        <CircularProgress
          color={color}
          progress={getProgress()}
          size={200}
          strokeWidth={12}
        />
        <Box
          alignItems="center"
          height={200}
          justifyContent="center"
          position="absolute"
          width={200}
        >
          <Text fontSize={48} fontWeight="700">
            {formatTime(remaining)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
