
import React from 'react';
import { FocusState } from '../types';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  focusState: FocusState;
  toggleFocus: () => void;
  resetFocus: () => void;
}

const PomodoroModal: React.FC<PomodoroModalProps> = ({ 
  isOpen, 
  onClose, 
  onMinimize, 
  focusState, 
  toggleFocus, 
  resetFocus 
}) => {
  if (!isOpen) return null;

  const { mode, timeLeft, totalTime, isActive } = focusState;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className={`w-full max-w-md rounded-[3rem] border-[8px] border-white shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in duration-300 ${mode === 'FOCUS' ? 'bg-[#ef5350]' : 'bg-[#66bb6a]'}`}>
        
        {/* Controls Top */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button 
            onClick={onMinimize}
            className="w-10 h-10 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-white font-bold hover:bg-white/40 transition-all title='Thu nhỏ'"
          >
            ➖
          </button>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xl hover:bg-white/40 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <h2 className="pixel-font text-white text-lg mb-2 drop-shadow-md">
            {mode === 'FOCUS' ? 'LÒ LUYỆN TẬP' : 'GIỜ NGHỈ NGƠI'}
          </h2>
          <p className="text-white/80 font-bold text-xs mb-8 uppercase tracking-widest">
            {mode === 'FOCUS' ? 'Tập trung để nhận thưởng' : 'Thư giãn một chút nào'}
          </p>

          {/* Progress Circle Container - Fixed Clipping with viewBox */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8 bg-black/10 rounded-full p-2">
            <svg viewBox="0 0 256 256" className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="115"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="16"
                fill="transparent"
              />
              <circle
                cx="128"
                cy="128"
                r="115"
                stroke="white"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={722.5}
                strokeDashoffset={722.5 - (722.5 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="flex flex-col items-center relative z-10">
              <span className="pixel-font text-5xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">{formatTime(timeLeft)}</span>
              <span className="text-white/70 text-[10px] font-bold mt-2 uppercase tracking-widest">
                {isActive ? 'Đang chạy' : 'Đang tạm dừng'}
              </span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex gap-4 w-full">
            <button 
              onClick={toggleFocus}
              className={`flex-1 py-4 rounded-2xl border-4 border-white font-black text-xl shadow-xl transition-all active:scale-95 ${isActive ? 'bg-orange-500 text-white' : 'bg-white text-red-500'}`}
            >
              {isActive ? 'TẠM DỪNG' : 'BẮT ĐẦU'}
            </button>
            <button 
              onClick={resetFocus}
              className="px-6 py-4 rounded-2xl border-4 border-white bg-white/20 text-white font-black text-xl shadow-xl hover:bg-white/30 active:scale-95 transition-all"
            >
              ↺
            </button>
          </div>

          {/* Reward Box */}
          <div className="mt-8 bg-black/20 p-4 rounded-2xl border border-white/20 w-full backdrop-blur-sm">
            <div className="flex justify-between items-center text-white/80 font-bold text-[10px] uppercase">
              <span>Phần thưởng hoàn thành:</span>
              <div className="flex gap-3">
                <span className="text-yellow-400">🪙 100</span>
                <span className="text-cyan-400">⚡ 100</span>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-[10px] text-white/50 italic">Bạn có thể thu nhỏ để vừa làm nông vừa tập trung!</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroModal;
