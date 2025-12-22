/**
 * FarmGameScreen
 * Main farm game screen with crop management
 */

import type { CropId } from '@/types/game';

import { useCallback, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useAutoSave, useFarm, useGameLoop, usePomodoroLoop } from '@/hooks';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import { CropSelector } from '@/components/molecules/CropSelector';
import { PomodoroModal } from '@/components/organisms/PomodoroModal';
import { ShopModal } from '@/components/organisms/ShopModal';

import { useGameStore } from '@/stores/gameStore';

import {
    FarmGrid,
    FarmHeader,
    PomodoroMiniTimer,
} from './components';

export function FarmGameScreen() {
    const { handlePlantCrop, handlePlotClick, plots } = useFarm();
    const openModal = useGameStore((state) => state.openModal);
    const closeModal = useGameStore((state) => state.closeModal);
    const activeModal = useGameStore((state) => state.activeModal);
    const [showCropSelector, setShowCropSelector] = useState(false);
    const [selectedPlotId, setSelectedPlotId] = useState<string | undefined>(undefined);

    // Initialize game loops
    useGameLoop();
    usePomodoroLoop();
    useAutoSave();

    const handlePlotPress = useCallback((plotId: string) => {
        const plot = plots.find((p) => p.id === plotId);
        if (!plot) return;

        if (plot.status === 'READY') {
            handlePlotClick(plotId);
        } else if (plot.status === 'EMPTY') {
            setSelectedPlotId(plotId);
            setShowCropSelector(true);
        }
    }, [plots, handlePlotClick]);

    const handleCropSelect = useCallback((cropId: CropId) => {
        if (selectedPlotId) {
            handlePlantCrop(selectedPlotId, cropId);
            setShowCropSelector(false);
            setSelectedPlotId(undefined);
        }
    }, [selectedPlotId, handlePlantCrop]);

    const handleCropSelectorClose = useCallback(() => {
        setShowCropSelector(false);
        setSelectedPlotId(undefined);
    }, []);

    const handlePomodoroPress = useCallback(() => {
        openModal('POMODORO');
    }, [openModal]);

    const handleShopPress = useCallback(() => {
        openModal('SHOP');
    }, [openModal]);

    const handleStoragePress = useCallback(() => {
        openModal('SHOP');
    }, [openModal]);

    const handleExpansionPress = useCallback(() => {
        // TODO: Handle expansion logic
    }, []);

    return (
        <LinearGradient
            colors={['#66bb6a', '#66bb6a']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    backgroundColor="#66bb6a"
                    barStyle="light-content"
                />
                <FarmHeader
                    onPomodoroPress={handlePomodoroPress}
                    onShopPress={handleShopPress}
                    onStoragePress={handleStoragePress}
                />

                {/* Farm Grid with Expansion Area */}
                <Box backgroundColor="breakGreen" flex={1} position="relative">
                    <FarmGrid
                        onExpansionPress={handleExpansionPress}
                        onPlotPress={handlePlotPress}
                        plots={plots}
                    />
                </Box>

                {/* Status text */}
                <Box alignItems="center" backgroundColor="farmCardBg" padding="s">
                    <Text color="textPrimary" fontSize={11} textAlign="center">
                        🌱 Tap EMPTY plots to plant • Tap READY to harvest
                    </Text>
                </Box>

                {/* Mini Timer when Pomodoro is running */}
                <PomodoroMiniTimer onPress={handlePomodoroPress} />

                {/* Modals */}
                <PomodoroModal
                    onClose={closeModal}
                    visible={activeModal === 'POMODORO'}
                />
                <ShopModal
                    onClose={closeModal}
                    visible={activeModal === 'SHOP'}
                />

                {/* Crop Selector Modal */}
                <CropSelector
                    onClose={handleCropSelectorClose}
                    onSelect={handleCropSelect}
                    visible={showCropSelector}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});

