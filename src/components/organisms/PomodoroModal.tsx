/**
 * PomodoroModal Component
 * Pomodoro timer modal with focus/break modes
 */

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import { CircularProgress } from '@/components/atoms/CircularProgress';
import Text from '@/components/atoms/Text';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { POMODORO_DURATIONS } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

const SECONDS_PER_MINUTE = 60;
const MAX_PERCENTAGE = 100;

type PomodoroModalProps = {
  readonly onClose: () => void;
  readonly visible: boolean;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
  const secs = seconds % SECONDS_PER_MINUTE;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function PomodoroModal({ onClose, visible }: PomodoroModalProps) {
  const pomodoro = useGameStore((state) => state.pomodoro);
  const startPomodoro = useGameStore((state) => state.startPomodoro);
  const pausePomodoro = useGameStore((state) => state.pausePomodoro);
  const resumePomodoro = useGameStore((state) => state.resumePomodoro);
  const resetPomodoro = useGameStore((state) => state.resetPomodoro);

  const getModeColor = () => {
    switch (pomodoro.mode) {
      case 'BREAK': {
        return 'breakGreen';
      }
      case 'FOCUS': {
        return 'focusRed';
      }
      default: {
        return 'cardBg';
      }
    }
  };

  const getModeLabel = () => {
    switch (pomodoro.mode) {
      case 'BREAK': {
        return '☕ Nghỉ Ngơi';
      }
      case 'FOCUS': {
        return '🍅 Tập Trung';
      }
      default: {
        return '⏸️ Sẵn Sàng';
      }
    }
  };

  const getProgress = () => {
    if (pomodoro.mode === 'IDLE') return 0;
    const totalDuration = POMODORO_DURATIONS[pomodoro.mode];
    return ((totalDuration - pomodoro.remaining) / totalDuration) * MAX_PERCENTAGE;
  };

  const handleStart = () => {
    if (pomodoro.mode === 'IDLE') {
      startPomodoro('FOCUS');
    } else if (pomodoro.isRunning) {
      pausePomodoro();
    } else {
      resumePomodoro();
    }
  };

  const renderControls = () => {
    if (pomodoro.mode === 'IDLE') {
      return (
        <Box flexDirection="row" gap="m">
          <Box flex={1}>
            <Button
              backgroundColor="focusRed"
              borderColor="farmBorder"
              borderRadius="m"
              borderWidth={2}
              onPress={() => { startPomodoro('FOCUS'); }}
              paddingVertical="l"
              textColor="textPrimary"
              title="🍅 Bắt Đầu Tập Trung"
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box flexDirection="row" gap="m">
        <Box flex={1}>
          <Button
            backgroundColor={pomodoro.isRunning ? 'highlightYellow' : 'success'}
            borderColor="farmBorder"
            borderRadius="m"
            borderWidth={2}
            onPress={handleStart}
            paddingVertical="l"
            textColor="textPrimary"
            title={pomodoro.isRunning ? '⏸️ Tạm Dừng' : '▶️ Tiếp Tục'}
          />
        </Box>
        <Box width={80}>
          <Button
            backgroundColor="danger"
            borderColor="farmBorder"
            borderRadius="m"
            borderWidth={2}
            onPress={resetPomodoro}
            paddingVertical="l"
            textColor="textPrimary"
            title="🔄 Reset"
          />
        </Box>
      </Box>
    );
  };

  return (
    <ModalWrapper onClose={onClose} title="🍅 Pomodoro Timer" visible={visible} width={360}>
      {/* Mode Label */}
      <Box alignItems="center" mb="l">
        <Text fontSize={18} fontWeight="700" variant="pixelHeader">
          {getModeLabel()}
        </Text>
      </Box>

      {/* Circular Timer */}
      <Box alignItems="center" mb="l">
        <Box position="relative">
          <CircularProgress
            color={getModeColor()}
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
              {formatTime(pomodoro.remaining)}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
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
            🍅 {pomodoro.completedSessions}
          </Text>
        </Box>
        <Box alignItems="center">
          <Text color="textSecondary" fontSize={11} mb="xs">
            Tổng cộng
          </Text>
          <Text fontSize={16} fontWeight="700">
            ⚡ {pomodoro.completedSessions}
          </Text>
        </Box>
      </Box>

      {/* Controls */}
      {renderControls()}

      {/* Info */}
      <Box alignItems="center" mt="m">
        <Text color="textSecondary" fontSize={10} textAlign="center">
          Focus: 25 phút • Break: 5 phút
        </Text>
        <Text color="textSecondary" fontSize={10} mt="xs" textAlign="center">
          Hoàn thành session để nhận XP
        </Text>
      </Box>
    </ModalWrapper>
  );
}
