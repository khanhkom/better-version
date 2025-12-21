
import React, { useState } from 'react';
import { LandPlot, PlotStatus, Crop } from '../types';
import { CROPS } from '../constants';
import ToolBar from './ToolBar';

interface PlotProps {
  plot: LandPlot;
  onAction: (id: string, toolId?: string) => void;
  onPlant: (plotId: string, seedId: string) => void;
  isPicking: boolean;
  availableSeeds: Record<string, number>;
}

const Plot: React.FC<PlotProps> = ({ plot, onAction, onPlant, isPicking, availableSeeds }) => {
  const [showTools, setShowTools] = useState(false);
  const crop = plot.cropId ? CROPS[plot.cropId] : null;

  const handlePlotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (plot.status === PlotStatus.PLANTED) {
      setShowTools(!showTools);
    } else {
      onAction(plot.id);
    }
  };

  const handleToolAction = (toolId: string) => {
    setShowTools(false);
    onAction(plot.id, toolId);
  };

  const renderContent = () => {
    // If picking seeds, show the picker menu
    if (isPicking && plot.status === PlotStatus.EMPTY) {
      const seedIds = Object.keys(availableSeeds).filter(id => availableSeeds[id] > 0);
      
      return (
        <div className="absolute inset-0 z-20 flex flex-wrap gap-1 p-2 bg-black/40 backdrop-blur-sm rounded-lg items-center justify-center overflow-auto animate-in fade-in zoom-in duration-200">
          {seedIds.length > 0 ? (
            seedIds.map(id => (
              <button
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlant(plot.id, id);
                }}
                className="relative bg-white p-1 rounded-md border-2 border-yellow-400 hover:scale-110 transition-transform flex flex-col items-center min-w-[36px]"
              >
                <span className="text-xl">{CROPS[id].icon}</span>
                <span className="text-[8px] font-bold text-gray-800 leading-none">{availableSeeds[id]}</span>
              </button>
            ))
          ) : (
            <div className="text-white text-[8px] font-bold text-center px-1">Hết hạt giống!</div>
          )}
        </div>
      );
    }

    switch (plot.status) {
      case PlotStatus.EMPTY:
        return (
          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-white text-[10px] font-bold text-center px-1">Chạm để trồng</span>
          </div>
        );
      case PlotStatus.PLANTED:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full p-2 relative">
            {showTools && <ToolBar onAction={handleToolAction} onClose={() => setShowTools(false)} />}
            <div className="relative w-full h-2 bg-black/30 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-1000"
                style={{ width: `${plot.progress}%` }}
              />
            </div>
            <span className="text-xl filter grayscale contrast-125">🌱</span>
          </div>
        );
      case PlotStatus.READY:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full p-1 cursor-pointer transform hover:scale-110 transition-transform">
            <span className="text-4xl sway">{crop?.icon}</span>
            <span className="bg-yellow-400 text-[10px] px-1 rounded-sm font-bold text-black mt-1 uppercase animate-pulse">Thu hoạch!</span>
          </div>
        );
    }
  };

  return (
    <div 
      onClick={handlePlotClick}
      className={`
        relative aspect-square w-full rounded-lg border-4 border-[#5d3a1a] shadow-inner cursor-pointer group
        ${plot.status === PlotStatus.EMPTY ? 'bg-[#8b5a2b] hover:bg-[#a06a3a]' : 'bg-[#6d4c41]'}
        transition-all duration-200 
        ${showTools || isPicking ? 'z-40' : 'z-0'}
      `}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dirt.png')] rounded-md overflow-hidden"></div>
      {renderContent()}
    </div>
  );
};

export default Plot;
