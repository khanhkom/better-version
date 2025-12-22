/**
 * FarmGrid Component
 * Grid of farm plots with responsive layout
 */

import type { LandPlot } from '@/types/game';

import { useEffect } from 'react';
import { ImageBackground } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import Box from '@/components/atoms/Box';
import { PlotCard } from '@/components/molecules/PlotCard';

import { images } from '@/assets/images';
import { scaleWidth } from '@/configs/functions';

import { ExpansionArea } from './ExpansionArea';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const PLOT_SIZE = scaleWidth(46);
const PLOTS_PER_ROW = 6;
const FLOAT_DISTANCE = 8;
const FLOAT_DURATION = 2000;

type FarmGridProps = {
    readonly onExpansionPress: () => void;
    readonly onPlotPress: (plotId: string) => void;
    readonly plots: readonly LandPlot[];
};

export function FarmGrid({ onExpansionPress, onPlotPress, plots }: FarmGridProps) {
    // Floating animation
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);

    useEffect(() => {
        // Vertical floating
        translateY.value = withRepeat(
            withSequence(
                withTiming(-FLOAT_DISTANCE, { duration: FLOAT_DURATION }),
                withTiming(FLOAT_DISTANCE, { duration: FLOAT_DURATION })
            ),
            -1,
            true
        );

        // Subtle rotation
        rotate.value = withRepeat(
            withSequence(
                withTiming(1, { duration: FLOAT_DURATION * 2 }),
                withTiming(-1, { duration: FLOAT_DURATION * 2 })
            ),
            -1,
            true
        );
    }, [translateY, rotate]);

    const floatingStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    // Group plots into rows of 6
    const rows: LandPlot[][] = [];
    for (let index = 0; index < plots.length; index += PLOTS_PER_ROW) {
        rows.push(plots.slice(index, index + PLOTS_PER_ROW));
    }

    return (
        <AnimatedImageBackground
            borderRadius={12}
            resizeMode='stretch'
            source={images.farm.backgroundFarm}
            style={[
                {
                    borderRadius: 12,
                    height: 180,
                    paddingVertical: 16,
                    width: scaleWidth(380),
                },
                floatingStyle,
            ]}
        >
            <Box flex={1} padding="m">
                <Box gap="m">
                    {rows.map((row) => (
                        <Box flexDirection="row" gap="s" justifyContent="center" key={row[0]?.id}>
                            {row.map((plot) => (
                                <Box height={PLOT_SIZE} key={plot.id} width={PLOT_SIZE}>
                                    <PlotCard
                                        onPress={() => { onPlotPress(plot.id); }}
                                        plot={plot}
                                        testID={`plot-${plot.id}`}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ))}
                    {/* Expansion Area - Next slot after plots */}
                    <Box flexDirection="row" gap="s" paddingLeft="xl">
                        <Box height={PLOT_SIZE} width={PLOT_SIZE}>
                            <ExpansionArea onPress={onExpansionPress} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </AnimatedImageBackground>
    );
}

