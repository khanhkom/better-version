/**
 * FarmGameScreen
 * Main farm game screen with crop management
 */

import type { CropId } from '@/types/game';

import { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useAutoSave, useFarm, useGameLoop, usePomodoroLoop } from '@/hooks';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import { CropSelector } from '@/components/molecules/CropSelector';
import { HabitModal } from '@/components/organisms/HabitModal';
import { NavigationBar } from '@/components/organisms/NavigationBar';
import { PomodoroModal } from '@/components/organisms/PomodoroModal';
import { ShopModal } from '@/components/organisms/ShopModal';

import { useGameStore } from '@/stores/gameStore';

import { FarmGrid, FarmHeader } from './components';

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

    const handleHabitsPress = useCallback(() => {
        openModal('HABITS');
    }, [openModal]);

    const handlePomodoroPress = useCallback(() => {
        openModal('POMODORO');
    }, [openModal]);

    const handleShopPress = useCallback(() => {
        openModal('SHOP');
    }, [openModal]);

    return (
        <LinearGradient
            colors={['#2d5a27', '#3a7332']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <FarmHeader />

                <FarmGrid onPlotPress={handlePlotPress} plots={plots} />

                {/* Status text */}
                <Box alignItems="center" backgroundColor="farmCardBg" padding="s">
                    <Text color="textPrimary" fontSize={11} textAlign="center">
                        🌱 Tap EMPTY plots to plant • Tap READY to harvest
                    </Text>
                </Box>

                {/* Navigation Bar */}
                <NavigationBar
                    onHabitsPress={handleHabitsPress}
                    onPomodoroPress={handlePomodoroPress}
                    onShopPress={handleShopPress}
                />

                {/* Modals */}
                <HabitModal
                    onClose={closeModal}
                    visible={activeModal === 'HABITS'}
                />
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

