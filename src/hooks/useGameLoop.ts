/**
 * useGameLoop Hook
 * Manages crop growth game loop with 1s tick rate
 */

import { useEffect } from 'react';

import { CROPS, TICK_RATE } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

export const useGameLoop = () => {
  const plots = useGameStore((state) => state.plots);
  const updatePlotProgress = useGameStore((state) => state.updatePlotProgress);
  const updatePlotStage = useGameStore((state) => state.updatePlotStage);

  useEffect(() => {
    const interval = setInterval(() => {
      for (const plot of plots) {
        if (plot.status === 'PLANTED' && plot.cropId && plot.plantedAt) {
          const crop = CROPS[plot.cropId];
          const elapsed = (Date.now() - plot.plantedAt) / 1000; // seconds
          const progress = Math.min(100, (elapsed / crop.growthTime) * 100);

          updatePlotProgress(plot.id, progress);

          // Calculate current stage based on progress
          const totalStages = crop.stages.length;
          const currentStage = Math.min(
            totalStages - 1,
            Math.floor((progress / 100) * totalStages),
          );

          updatePlotStage(plot.id, currentStage);

          // Auto-update status to READY when progress reaches 100%
          if (progress >= 100) {
            useGameStore.setState((state) => ({
              plots: state.plots.map((p) =>
                p.id === plot.id ? { ...p, status: 'READY' } : p,
              ),
            }));
          }
        }
      }
    }, TICK_RATE);

    return () => {
      clearInterval(interval);
    };
  }, [plots, updatePlotProgress, updatePlotStage]);
};
