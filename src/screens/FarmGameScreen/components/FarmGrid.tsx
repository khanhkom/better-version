/**
 * FarmGrid Component
 * Grid of farm plots with responsive layout
 */

import type { LandPlot } from '@/types/game';

import { ImageBackground } from 'react-native';

import Box from '@/components/atoms/Box';
import { PlotCard } from '@/components/molecules/PlotCard';

import { images } from '@/assets/images';
import { scaleWidth } from '@/configs/functions';

import { ExpansionArea } from './ExpansionArea';

const PLOT_SIZE = scaleWidth(46);
const PLOTS_PER_ROW = 6;

type FarmGridProps = {
    readonly onExpansionPress: () => void;
    readonly onPlotPress: (plotId: string) => void;
    readonly plots: readonly LandPlot[];
};

export function FarmGrid({ onExpansionPress, onPlotPress, plots }: FarmGridProps) {
    // Group plots into rows of 6
    const rows: LandPlot[][] = [];
    for (let index = 0; index < plots.length; index += PLOTS_PER_ROW) {
        rows.push(plots.slice(index, index + PLOTS_PER_ROW));
    }

    return (
        <ImageBackground
            borderRadius={12}
            resizeMode='stretch'
            source={images.farm.backgroundFarm}
            style={{
                borderRadius: 12, height: 180, paddingVertical: 16,
                width: scaleWidth(380)
            }}
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
        </ImageBackground>
    );
}

