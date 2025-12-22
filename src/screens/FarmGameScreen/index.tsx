/**
 * FarmGameScreen
 * Main farm game screen with crop management
 */

import type { CropId } from '@/types/game';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useAutoSave, useFarm, useGameLoop, usePomodoroLoop } from '@/hooks';

import Box from '@/components/atoms/Box';
import { CropSelector } from '@/components/molecules/CropSelector';
import { PomodoroModal } from '@/components/organisms/PomodoroModal';
import { ShopModal } from '@/components/organisms/ShopModal';

import { PLOT_BASE_COST } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

import {
    FarmGrid,
    FarmHeader,
    PomodoroMiniTimer,
    PurchasePlotModal,
} from './components';

const PLOTS_PER_GRID = 12;

export function FarmGameScreen() {
    const { handlePlantCrop, handlePlotClick, plots } = useFarm();
    const openModal = useGameStore((state) => state.openModal);
    const closeModal = useGameStore((state) => state.closeModal);
    const activeModal = useGameStore((state) => state.activeModal);
    const money = useGameStore((state) => state.money);
    const purchasePlot = useGameStore((state) => state.purchasePlot);
    const [showCropSelector, setShowCropSelector] = useState(false);
    const [selectedPlotId, setSelectedPlotId] = useState<string | undefined>(undefined);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedCropForPlanting, setSelectedCropForPlanting] = useState<CropId | null>(null);

    // Update StatusBar color when screen is focused
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#2E7D32');
        }, [])
    );

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
        setShowPurchaseModal(true);
    }, []);

    const handleConfirmPurchase = useCallback(() => {
        const success = purchasePlot();
        if (success) {
            setShowPurchaseModal(false);
        }
    }, [purchasePlot]);

    const handleClosePurchaseModal = useCallback(() => {
        setShowPurchaseModal(false);
    }, []);

    // Split plots into grids of max 12 plots each
    const farmGrids: typeof plots[] = [];
    for (let index = 0; index < plots.length; index += PLOTS_PER_GRID) {
        farmGrids.push(plots.slice(index, index + PLOTS_PER_GRID));
    }

    // If last grid is full (12 plots), create new empty grid for expansion
    const lastGrid = farmGrids.at(-1);
    const isLastGridFull = lastGrid && lastGrid.length === PLOTS_PER_GRID;
    if (isLastGridFull) {
        farmGrids.push([]);
    }

    return (
        <LinearGradient
            colors={['#66BB6A', '#388E3C']}
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#2E7D32"
                barStyle="light-content"
            />
            <SafeAreaView style={styles.safeArea}>
                <FarmHeader
                    onPomodoroPress={handlePomodoroPress}
                    onShopPress={handleShopPress}
                    onStoragePress={handleStoragePress}
                />

                {/* Farm Grids with Expansion Area */}
                <Box flex={1} gap="xxl" >
                    {farmGrids.map((gridPlots, gridIndex) => {
                        const isLastGrid = gridIndex === farmGrids.length - 1;
                        const gridKey = gridPlots[0]?.id ?? `grid-${gridIndex}`;
                        return (
                            <FarmGrid
                                key={gridKey}
                                onExpansionPress={handleExpansionPress}
                                onPlotPress={handlePlotPress}
                                plots={gridPlots}
                                showExpansion={isLastGrid}
                            />
                        );
                    })}
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

                {/* Purchase Plot Modal */}
                <PurchasePlotModal
                    cost={(plots.length + 1) * PLOT_BASE_COST}
                    currentMoney={money}
                    onClose={handleClosePurchaseModal}
                    onConfirm={handleConfirmPurchase}
                    plotNumber={plots.length + 1}
                    visible={showPurchaseModal}
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

