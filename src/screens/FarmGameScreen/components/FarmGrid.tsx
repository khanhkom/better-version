/**
 * FarmGrid Component
 * Grid of farm plots with responsive layout
 */

import type { LandPlot } from '@/types/game';

import { FlatList } from 'react-native';

import Box from '@/components/atoms/Box';
import { PlotCard } from '@/components/molecules/PlotCard';

const PLOT_SIZE = 120;

type FarmGridProps = {
    readonly onPlotPress: (plotId: string) => void;
    readonly plots: readonly LandPlot[];
};

export function FarmGrid({ onPlotPress, plots }: FarmGridProps) {
    return (
        <Box flex={1} padding="m">
            <FlatList
                columnWrapperStyle={{ gap: 12, justifyContent: 'center' }}
                contentContainerStyle={{ gap: 12 }}
                data={plots as LandPlot[]}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <Box height={PLOT_SIZE} width={PLOT_SIZE}>
                        <PlotCard
                            onPress={() => { onPlotPress(item.id); }}
                            plot={item}
                            testID={`plot-${item.id}`}
                        />
                    </Box>
                )}
            />
        </Box>
    );
}

