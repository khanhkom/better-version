
import React from 'react';

interface ToolBarProps {
  onAction: (actionId: string) => void;
  onClose: () => void;
}

const TOOLS = [
  { id: 'water', icon: '🚿', label: 'Tưới nước' },
  { id: 'dig', icon: '⛏️', label: 'Cuốc đất' },
  { id: 'plant', icon: '🌱', label: 'Gieo hạt' }
];

const ToolBar: React.FC<ToolBarProps> = ({ onAction, onClose }) => {
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null);

  return (
    <div className="absolute inset-x-0 -top-16 flex flex-col items-center z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Tool Label */}
      <div className="h-6 mb-1">
        {hoveredLabel && (
          <span className="text-yellow-400 font-bold text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {hoveredLabel}
          </span>
        )}
      </div>

      {/* Bar Container */}
      <div className="bg-white rounded-2xl border-4 border-[#56ccf2] shadow-xl px-4 py-2 flex gap-6 items-center">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onMouseEnter={() => setHoveredLabel(tool.label)}
            onMouseLeave={() => setHoveredLabel(null)}
            onClick={(e) => {
              e.stopPropagation();
              onAction(tool.id);
            }}
            className="text-2xl hover:scale-125 transition-transform active:scale-95"
          >
            {tool.icon}
          </button>
        ))}
      </div>
      
      {/* Close indicator/Overlay click handler helper */}
      <div className="absolute -inset-20 -z-10" onClick={(e) => { e.stopPropagation(); onClose(); }} />
    </div>
  );
};

export default ToolBar;
