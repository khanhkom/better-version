/**
 * FarmHeader Component
 * Display player stats and level progress
 */

import type { Theme } from '@/theme/restyle';

import { Pressable } from 'react-native';

import { usePlayerStats } from '@/hooks';

import Box from '@/components/atoms/Box';
import ProgressBar from '@/components/atoms/ProgressBar';
import Text from '@/components/atoms/Text';

import { POMODORO_DURATIONS, XP_PER_LEVEL } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

const SECONDS_PER_MINUTE = 60;

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = seconds % SECONDS_PER_MINUTE;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

type ActionButtonProps = {
    readonly backgroundColor: keyof Theme['colors'];
    readonly icon: string;
    readonly label: string;
    readonly onPress: () => void;
};

type FarmHeaderProps = {
    readonly onPomodoroPress: () => void;
    readonly onShopPress: () => void;
    readonly onStoragePress: () => void;
};

export function FarmHeader({ onPomodoroPress, onShopPress, onStoragePress }: FarmHeaderProps) {
    const { diamonds, level, money, xp } = usePlayerStats();
    const pomodoro = useGameStore((state) => state.pomodoro);

    const xpInCurrentLevel = xp % XP_PER_LEVEL;
    const pomodoroTime =
        pomodoro.mode === 'IDLE'
            ? formatTime(POMODORO_DURATIONS.FOCUS)
            : formatTime(pomodoro.remaining);

    return (
        <Box backgroundColor="farmGradientStart" gap="s" padding="m">
            {/* Level and Progress Row */}
            <Box alignItems="center" flexDirection="row" gap="m">
                {/* Avatar placeholder */}
                <Box
                    backgroundColor="textMuted"
                    borderRadius="m"
                    height={80}
                    marginRight="m"
                    width={80}
                />

                {/* Level and Stats */}
                <Box flex={1}>
                    <Box alignItems="center" flexDirection="row" gap="m" justifyContent="space-between">
                        <Text color="white" fontSize={14} fontWeight="700">
                            Cấp {level}
                        </Text>

                        <Box flexDirection="row" gap="s">
                            <Box alignItems="center" flexDirection="row" gap="xs">
                                <Text fontSize={18}>💰</Text>
                                <Text color="white" fontSize={14} fontWeight="700">
                                    {money.toString()}
                                </Text>
                            </Box>
                            <Box alignItems="center" flexDirection="row" gap="xs">
                                <Text fontSize={18}>💎</Text>
                                <Text color="white" fontSize={14} fontWeight="700">
                                    {diamonds.toString()}
                                </Text>
                            </Box>
                        </Box>
                    </Box>

                    <Box marginTop="m">
                        <ProgressBar
                            current={xpInCurrentLevel}
                            label={`${xpInCurrentLevel} / ${XP_PER_LEVEL} XP`}
                            max={XP_PER_LEVEL}
                            variant="yellow"
                        />
                    </Box>
                </Box>
            </Box>

            {/* Action Buttons Row */}
            <Box flexDirection="row" gap="s" marginTop="l">
                <ActionButton
                    backgroundColor="focusRed"
                    icon="⏱️"
                    label={pomodoroTime}
                    onPress={onPomodoroPress}
                />
                <ActionButton
                    backgroundColor="highlightYellow"
                    icon="📦"
                    label="Kho"
                    onPress={onStoragePress}
                />
                <ActionButton
                    backgroundColor="highlightOrange"
                    icon="🛒"
                    label="Cửa hàng"
                    onPress={onShopPress}
                />
            </Box>
        </Box>
    );
}

function ActionButton({ backgroundColor, icon, label, onPress }: ActionButtonProps) {
    return (
        <Pressable onPress={onPress}>
            <Box
                alignItems="center"
                backgroundColor={backgroundColor}
                borderRadius="s"
                flexDirection="row"
                gap="xs"
                paddingHorizontal="m"
                paddingVertical="s"
            >
                <Text fontSize={18}>{icon}</Text>
                <Text color="white" fontSize={14} fontWeight="700">
                    {label}
                </Text>
            </Box>
        </Pressable>
    );
}
