/**
 * PomodoroMiniTimer Component
 * Small timer display in corner when pomodoro is running
 */

import { Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

import { useGameStore } from '@/stores/gameStore';

type PomodoroMiniTimerProps = {
    readonly onPress: () => void;
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function PomodoroMiniTimer({ onPress }: PomodoroMiniTimerProps) {
    const pomodoro = useGameStore((state) => state.pomodoro);

    if (!pomodoro.isRunning || pomodoro.mode === 'IDLE') {
        return null;
    }

    return (
        <Pressable onPress={onPress}>
            <Box
                alignItems="center"
                backgroundColor="focusRed"
                borderColor="danger"
                borderRadius="m"
                borderWidth={2}
                bottom={20}
                paddingHorizontal="m"
                paddingVertical="s"
                position="absolute"
                right={20}
            >
                <Text color="white" fontSize={12} fontWeight="700">
                    🍅 {formatTime(pomodoro.remaining)}
                </Text>
            </Box>
        </Pressable>
    );
}

