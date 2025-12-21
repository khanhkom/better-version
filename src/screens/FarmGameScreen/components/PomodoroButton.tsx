/**
 * PomodoroButton Component
 * Circular button for starting pomodoro timer
 */

import { Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

import { POMODORO_DURATIONS } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

type PomodoroButtonProps = {
    readonly onPress: () => void;
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function PomodoroButton({ onPress }: PomodoroButtonProps) {
    const pomodoro = useGameStore((state) => state.pomodoro);

    // Get display time
    const displayTime = pomodoro.mode === 'IDLE'
        ? formatTime(POMODORO_DURATIONS.FOCUS)
        : formatTime(pomodoro.remaining);

    return (
        <Pressable onPress={onPress}>
            <Box
                alignItems="center"
                backgroundColor="focusRed"
                borderColor="danger"
                borderRadius="full"
                borderWidth={4}
                height={100}
                justifyContent="center"
                width={100}
            >
                <Text color="white" fontSize={11} fontWeight="700" mb="xs">
                    TẬP TRUNG
                </Text>
                <Text color="white" fontSize={16} fontWeight="700">
                    {displayTime}
                </Text>
            </Box>
        </Pressable>
    );
}

