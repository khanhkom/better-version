/**
 * PomodoroModal Component
 * Pomodoro timer modal with focus/break modes
 */

import theme from '@/theme/restyle';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { useGameStore } from '@/stores/gameStore';

import { PomodoroControls, PomodoroStats, PomodoroTimer } from './components';

type PomodoroModalProps = {
  readonly onClose: () => void;
  readonly visible: boolean;
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
        return theme.colors.breakGreen;
      }
      case 'FOCUS': {
        return theme.colors.focusRed;
      }
      default: {
        return theme.colors.cardBg;
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

  return (
    <ModalWrapper onClose={onClose} title="🍅 Pomodoro Timer" visible={visible} width={360}>
      {/* Mode Label */}
      <Box alignItems="center" mb="l">
        <Text fontSize={18} fontWeight="700" variant="pixelHeader">
          {getModeLabel()}
        </Text>
      </Box>

      {/* Circular Timer */}
      <PomodoroTimer
        color={getModeColor()}
        mode={pomodoro.mode}
        remaining={pomodoro.remaining}
      />

      {/* Stats */}
      <PomodoroStats completedSessions={pomodoro.completedSessions} />

      {/* Controls */}
      <PomodoroControls
        isRunning={pomodoro.isRunning}
        mode={pomodoro.mode}
        onPause={pausePomodoro}
        onReset={resetPomodoro}
        onResume={resumePomodoro}
        onStart={startPomodoro}
      />

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
