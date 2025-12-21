/**
 * useFarm Hook
 * Farm-specific actions and state
 */

import type { CropId } from '@/types/game';

import { useCallback } from 'react';

import { useGameStore } from '@/stores/gameStore';

export const useFarm = () => {
  const plots = useGameStore((state) => state.plots);
  const selectedTool = useGameStore((state) => state.selectedTool);
  const selectTool = useGameStore((state) => state.selectTool);
  const plantCrop = useGameStore((state) => state.plantCrop);
  const harvestCrop = useGameStore((state) => state.harvestCrop);

  const handlePlotClick = useCallback(
    (plotId: string) => {
      const plot = plots.find((p) => p.id === plotId);
      if (!plot) return;

      if (plot.status === 'READY') {
        harvestCrop(plotId);
      }
      // Plant logic handled in UI (crop selector modal)
    },
    [plots, harvestCrop],
  );

  const handlePlantCrop = useCallback(
    (plotId: string, cropId: CropId) => {
      return plantCrop(plotId, cropId);
    },
    [plantCrop],
  );

  return {
    handlePlantCrop,
    handlePlotClick,
    harvestCrop,
    plantCrop,
    plots,
    selectedTool,
    selectTool,
  };
};
