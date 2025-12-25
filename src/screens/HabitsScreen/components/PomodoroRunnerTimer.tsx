/**
 * PomodoroRunnerTimer Component
 * Displays Rive runner animation with countdown timer for active Pomodoro
 */

import { Pressable, View } from 'react-native';
import Rive, { Fit } from 'rive-react-native';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

import { scaleHeight, scaleWidth } from '@/configs/functions';
import { useGameStore } from '@/stores/gameStore';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

type PomodoroRunnerTimerProps = {
    readonly onPress?: () => void;
};

export function PomodoroRunnerTimer({ onPress }: PomodoroRunnerTimerProps) {
    const pomodoro = useGameStore((state) => state.pomodoro);

    // Only show when Pomodoro is running
    if (!pomodoro.isRunning || pomodoro.mode === 'IDLE') {
        return null;
    }

    return (
        <Pressable onPress={onPress} style={{ marginBottom: scaleHeight(20) }}>
            <Box alignItems="center" marginTop="m" paddingHorizontal="m">
                {/* Rive Runner Animation */}
                <View style={{ height: scaleHeight(240), width: scaleWidth(375) }}>
                    <Rive
                        autoplay
                        fit={Fit.Contain}
                        resourceName="runner"
                        style={{ height: '100%', width: '100%' }}
                    />
                </View>

                {/* Countdown Timer */}
                <Box alignItems="center" marginTop="s">
                    <Text color="white" fontSize={80} fontWeight="700">
                        {formatTime(pomodoro.remaining)}
                    </Text>
                    <Text color="habitBgWhite" fontSize={12} fontWeight="600" marginTop="xs">
                        {pomodoro.mode === 'FOCUS' ? '🍅 Focus Time' : '☕ Break Time'}
                    </Text>
                </Box>
            </Box>
        </Pressable>
    );
}
