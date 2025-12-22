/**
 * PomodoroStats Component
 * Display pomodoro session statistics
 */

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

type PomodoroStatsProps = {
  readonly completedSessions: number;
};

export function PomodoroStats({ completedSessions }: PomodoroStatsProps) {
  return (
    <Box
      backgroundColor="farmCardBgLight"
      borderRadius="m"
      flexDirection="row"
      gap="l"
      justifyContent="center"
      mb="l"
      padding="m"
    >
      <Box alignItems="center">
        <Text color="textSecondary" fontSize={11} mb="xs">
          Hoàn thành
        </Text>
        <Text fontSize={16} fontWeight="700">
          🍅 {completedSessions}
        </Text>
      </Box>
      <Box alignItems="center">
        <Text color="textSecondary" fontSize={11} mb="xs">
          Tổng cộng
        </Text>
        <Text fontSize={16} fontWeight="700">
          ⚡ {completedSessions}
        </Text>
      </Box>
    </Box>
  );
}
