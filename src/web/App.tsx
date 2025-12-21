
import React, { useState, useEffect, useRef } from 'react';
import { GameState, LandPlot, PlotStatus, Crop, Habit, HabitDifficulty, FocusState, FocusMode } from './types';
import { 
  CROPS, INITIAL_PLOTS_COUNT, TICK_RATE, 
  PLOT_UPGRADE_COST, INITIAL_HABITS, 
  XP_PER_LEVEL, DIAMONDS_PER_HARVEST,
  DIFFICULTY_SETTINGS
} from './constants';
import Plot from './components/Plot';
import StorageModal from './components/StorageModal';
import HabitBoard from './components/HabitBoard';
import PomodoroModal from './components/PomodoroModal';
import { getFarmAdvice } from './services/geminiService';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('pixel-farm-state-v12');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.habits = (parsed.habits || []).map((h: any) => ({
        ...h,
        completionHistory: h.completionHistory || (h.completedAt ? [h.completedAt] : [])
      }));
      return parsed;
    }
    
    const initialPlots: LandPlot[] = Array.from({ length: INITIAL_PLOTS_COUNT }).map((_, i) => ({
      id: `plot-${i}`,
      status: PlotStatus.EMPTY,
      progress: 0
    }));

    return {
      money: 100,
      diamonds: 100,
      xp: 0,
      level: 1,
      inventory: { 'tomato': 2 },
      harvested: {},
      plots: initialPlots,
      habits: INITIAL_HABITS
    };
  });

  // Pomodoro State
  const [focusState, setFocusState] = useState<FocusState>({
    isActive: false,
    mode: 'FOCUS',
    timeLeft: FOCUS_TIME,
    totalTime: FOCUS_TIME
  });
  const [isPomodoroMinimized, setIsPomodoroMinimized] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [activePickingPlotId, setActivePickingPlotId] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string>("Đang kết nối với người hàng xóm Gemini...");
  const [isAskingAdvice, setIsAskingAdvice] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isHabitBoardOpen, setIsHabitBoardOpen] = useState(false);
  const [storageTab, setStorageTab] = useState<'shop' | 'items' | 'warehouse' | 'seeds'>('shop');

  useEffect(() => {
    localStorage.setItem('pixel-farm-state-v12', JSON.stringify(gameState));
  }, [gameState]);

  // Pomodoro Logic
  useEffect(() => {
    if (focusState.isActive && focusState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setFocusState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (focusState.timeLeft === 0) {
      handleFocusComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [focusState.isActive, focusState.timeLeft]);

  const handleFocusComplete = () => {
    if (focusState.mode === 'FOCUS') {
      setGameState(prev => ({ ...prev, money: prev.money + 100, xp: prev.xp + 100 }));
      alert('Tuyệt vời! Bạn đã hoàn thành 25 phút tập trung và nhận được 100 Xu & 100 XP!');
      setFocusState({
        isActive: false,
        mode: 'BREAK',
        timeLeft: BREAK_TIME,
        totalTime: BREAK_TIME
      });
    } else {
      alert('Giờ nghỉ đã hết! Sẵn sàng tập trung chưa?');
      setFocusState({
        isActive: false,
        mode: 'FOCUS',
        timeLeft: FOCUS_TIME,
        totalTime: FOCUS_TIME
      });
    }
    setIsPomodoroMinimized(false);
    setIsPomodoroOpen(true);
  };

  const toggleFocus = () => setFocusState(prev => ({ ...prev, isActive: !prev.isActive }));
  const resetFocus = () => setFocusState(prev => ({
    ...prev,
    isActive: false,
    timeLeft: prev.mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME
  }));

  // Level Up logic
  useEffect(() => {
    const requiredXp = gameState.level * XP_PER_LEVEL;
    if (gameState.xp >= requiredXp) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - requiredXp
      }));
    }
  }, [gameState.xp, gameState.level]);

  // Game loop (Growth)
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const updatedPlots = prev.plots.map(plot => {
          if (plot.status === PlotStatus.PLANTED && plot.plantedAt && plot.cropId) {
            const crop = CROPS[plot.cropId];
            const elapsed = (now - plot.plantedAt) / 1000;
            const progress = Math.min(100, (elapsed / crop.growthTime) * 100);
            
            if (progress >= 100) {
              return { ...plot, progress: 100, status: PlotStatus.READY };
            }
            return { ...plot, progress };
          }
          return plot;
        });
        return { ...prev, plots: updatedPlots };
      });
    }, TICK_RATE);
    return () => clearInterval(timer);
  }, []);

  const handlePlotAction = (plotId: string, toolId?: string) => {
    const plot = gameState.plots.find(p => p.id === plotId);
    if (!plot) return;

    if (toolId) {
      switch (toolId) {
        case 'water':
          setGameState(prev => ({
            ...prev,
            plots: prev.plots.map(p => {
              if (p.id === plotId && p.status === PlotStatus.PLANTED) {
                const newProgress = Math.min(100, p.progress + 10);
                return { ...p, progress: newProgress, status: newProgress >= 100 ? PlotStatus.READY : p.status };
              }
              return p;
            })
          }));
          break;
        case 'dig':
          setGameState(prev => ({
            ...prev,
            plots: prev.plots.map(p => p.id === plotId ? { ...p, status: PlotStatus.EMPTY, cropId: undefined, plantedAt: undefined, progress: 0 } : p)
          }));
          break;
        case 'plant':
          setActivePickingPlotId(plotId);
          setGameState(prev => ({
            ...prev,
            plots: prev.plots.map(p => p.id === plotId ? { ...p, status: PlotStatus.EMPTY, cropId: undefined, plantedAt: undefined, progress: 0 } : p)
          }));
          break;
      }
      return;
    }

    if (plot.status === PlotStatus.EMPTY) {
      setActivePickingPlotId(activePickingPlotId === plotId ? null : plotId);
    } else if (plot.status === PlotStatus.READY && plot.cropId) {
      const harvestedCropId = plot.cropId;
      setGameState(prev => ({
        ...prev,
        diamonds: prev.diamonds + DIAMONDS_PER_HARVEST,
        harvested: { ...prev.harvested, [harvestedCropId]: (prev.harvested[harvestedCropId] || 0) + 1 },
        plots: prev.plots.map(p => p.id === plotId ? { ...p, status: PlotStatus.EMPTY, cropId: undefined, plantedAt: undefined, progress: 0 } : p)
      }));
    }
  };

  const handlePlant = (plotId: string, seedId: string) => {
    if ((gameState.inventory[seedId] || 0) > 0) {
      setGameState(prev => ({
        ...prev,
        inventory: { ...prev.inventory, [seedId]: prev.inventory[seedId] - 1 },
        plots: prev.plots.map(p => p.id === plotId ? { ...p, status: PlotStatus.PLANTED, cropId: seedId, plantedAt: Date.now(), progress: 0 } : p)
      }));
      setActivePickingPlotId(null);
    }
  };

  const buySeed = (cropId: string, currency: 'money' | 'diamonds', quantity: number) => {
    const crop = CROPS[cropId];
    if (currency === 'money' && gameState.money >= (crop.buyPrice * quantity)) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - (crop.buyPrice * quantity),
        inventory: { ...prev.inventory, [cropId]: (prev.inventory[cropId] || 0) + quantity }
      }));
    } else if (currency === 'diamonds' && gameState.diamonds >= (crop.diamondPrice * quantity)) {
      setGameState(prev => ({
        ...prev,
        diamonds: prev.diamonds - (crop.diamondPrice * quantity),
        inventory: { ...prev.inventory, [cropId]: (prev.inventory[cropId] || 0) + quantity }
      }));
    }
  };

  const completeHabit = (habitId: string) => {
    const habit = gameState.habits.find(h => h.id === habitId);
    if (!habit) return;
    const now = Date.now();
    setGameState(prev => ({
      ...prev,
      money: prev.money + habit.xuReward,
      xp: prev.xp + habit.xpReward,
      habits: prev.habits.map(h => h.id === habitId ? { ...h, completedAt: now, completionHistory: [...(h.completionHistory || []), now] } : h)
    }));
  };

  const addHabit = (newHabitData: Omit<Habit, 'id' | 'xuReward' | 'xpReward' | 'completionHistory'>) => {
    const baseXu = 10;
    const baseXp = 15;
    const diff = DIFFICULTY_SETTINGS[newHabitData.difficulty];
    const newHabit: Habit = { ...newHabitData, id: `h-${Date.now()}`, xuReward: baseXu * diff.xuMult, xpReward: baseXp * diff.xpMult, completionHistory: [] };
    setGameState(prev => ({ ...prev, habits: [newHabit, ...prev.habits] }));
  };

  const sellHarvest = (cropId: string) => {
    const count = gameState.harvested[cropId] || 0;
    if (count > 0) {
      const crop = CROPS[cropId];
      setGameState(prev => ({ ...prev, money: prev.money + (count * crop.sellPrice), harvested: { ...prev.harvested, [cropId]: 0 } }));
    }
  };

  const buyPlot = () => {
    if (gameState.money >= PLOT_UPGRADE_COST) {
      setGameState(prev => ({ ...prev, money: prev.money - PLOT_UPGRADE_COST, plots: [...prev.plots, { id: `plot-${prev.plots.length}`, status: PlotStatus.EMPTY, progress: 0 }] }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const askAdvice = async () => {
    setIsAskingAdvice(true);
    const newAdvice = await getFarmAdvice(gameState);
    setAdvice(newAdvice);
    setIsAskingAdvice(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="flex justify-between items-center px-2">
              <span className="pixel-font text-[10px] text-white bg-blue-600 px-2 py-1 rounded-t-lg">Cấp {gameState.level}</span>
              <span className="pixel-font text-[8px] text-blue-100">{gameState.xp} / {gameState.level * XP_PER_LEVEL} XP</span>
            </div>
            <div className="h-4 w-full bg-black/40 rounded-full border-2 border-blue-400 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-500" 
                style={{ width: `${(gameState.xp / (gameState.level * XP_PER_LEVEL)) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/90 p-2 px-4 rounded-2xl shadow-lg border-4 border-yellow-600">
               <span className="text-xl">🪙</span>
               <span className="pixel-font text-sm text-yellow-800">{gameState.money.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 p-2 px-4 rounded-2xl shadow-lg border-4 border-cyan-600">
               <span className="text-xl">💎</span>
               <span className="pixel-font text-sm text-cyan-800">{gameState.diamonds}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="pixel-font text-xl md:text-2xl text-white drop-shadow-md">NÔNG TRẠI GEMINI</h1>
          <div className="flex gap-2">
            <button 
               onClick={() => setIsHabitBoardOpen(true)}
               className="bg-[#8d6e63] text-white px-4 py-2 rounded-xl border-4 border-[#3e2723] font-bold shadow-lg hover:bg-[#6d4c41] transition-all flex items-center gap-2"
             >
               📋 Nhiệm Vụ
             </button>
             <button 
               onClick={() => setIsPomodoroOpen(true)}
               className="bg-[#ef5350] text-white px-4 py-2 rounded-xl border-4 border-[#c62828] font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
             >
               ⏱️ {focusState.isActive ? formatTime(focusState.timeLeft) : 'Tập Trung'}
             </button>
             <button 
               onClick={() => { setStorageTab('warehouse'); setIsStorageOpen(true); }}
               className="bg-yellow-500 text-white px-4 py-2 rounded-xl border-4 border-white font-bold shadow-lg hover:scale-105 transition-all"
             >
               📦 Kho
             </button>
             <button 
               onClick={() => { setStorageTab('shop'); setIsStorageOpen(true); }}
               className="bg-orange-500 text-white px-4 py-2 rounded-xl border-4 border-white font-bold shadow-lg hover:scale-105 transition-all"
             >
               🛒 Cửa hàng
             </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <div className="farm-grid bg-[#4caf50] rounded-[3rem] p-8 border-[12px] border-[#5d4037] shadow-[0_20px_0_0_#3e2723] min-h-[500px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gameState.plots.map(plot => (
              <Plot 
                key={plot.id} 
                plot={plot} 
                onAction={handlePlotAction}
                onPlant={handlePlant}
                isPicking={activePickingPlotId === plot.id}
                availableSeeds={gameState.inventory}
              />
            ))}
            
            <button
              onClick={buyPlot}
              disabled={gameState.money < PLOT_UPGRADE_COST}
              className={`relative aspect-square w-full rounded-lg border-4 border-dashed transition-all flex flex-col items-center justify-center p-2 group ${gameState.money >= PLOT_UPGRADE_COST ? 'bg-[#3e2723]/20 border-white/50 hover:bg-[#3e2723]/40 cursor-pointer' : 'bg-black/10 border-gray-400/50 cursor-not-allowed grayscale'}`}
            >
              <div className="text-4xl text-white/80 group-hover:scale-110 transition-transform">➕</div>
              <div className="mt-2 text-[10px] font-bold text-white bg-green-600/80 px-2 py-1 rounded-full border-2 border-white/50 shadow-sm">
                MỞ RỘNG
              </div>
              <div className="mt-1 text-[8px] font-bold text-white pixel-font">
                {PLOT_UPGRADE_COST} 🪙
              </div>
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="bg-white/95 p-6 rounded-[2rem] shadow-xl border-4 border-blue-400 relative max-w-2xl w-full">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] px-6 py-2 rounded-full pixel-font shadow-lg border-2 border-white">BÁC HÀNG XÓM KHUYÊN</div>
            <p className="text-sm text-gray-700 italic leading-relaxed text-center mt-2">"{advice}"</p>
            <div className="flex justify-center mt-4">
              <button 
                onClick={askAdvice} 
                disabled={isAskingAdvice} 
                className={`text-[10px] font-bold uppercase tracking-wider transition-all ${isAskingAdvice ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {isAskingAdvice ? 'Đang suy nghĩ...' : 'Hỏi thêm lời khuyên'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimized Pomodoro Widget */}
      {isPomodoroMinimized && (
        <div 
          onClick={() => { setIsPomodoroMinimized(false); setIsPomodoroOpen(true); }}
          className={`fixed bottom-8 right-8 w-20 h-20 rounded-full border-4 border-white shadow-2xl cursor-pointer flex flex-col items-center justify-center text-white z-[120] hover:scale-110 transition-all animate-bounce-slow ${focusState.mode === 'FOCUS' ? 'bg-[#ef5350]' : 'bg-[#66bb6a]'}`}
        >
          <span className="text-[10px] font-black">{focusState.mode === 'FOCUS' ? 'TẬP TRUNG' : 'NGHỈ'}</span>
          <span className="pixel-font text-xs">{formatTime(focusState.timeLeft)}</span>
          {!focusState.isActive && <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[8px] px-1 rounded border border-white">PAUSED</span>}
        </div>
      )}

      <StorageModal 
        isOpen={isStorageOpen}
        onClose={() => setIsStorageOpen(false)}
        gameState={gameState}
        activeTab={storageTab}
        setActiveTab={setStorageTab}
        onSell={sellHarvest}
        onSelectSeed={() => {}}
        onBuySeed={buySeed}
      />

      <HabitBoard 
        isOpen={isHabitBoardOpen}
        onClose={() => setIsHabitBoardOpen(false)}
        habits={gameState.habits}
        onComplete={completeHabit}
        onAddHabit={addHabit}
      />

      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        onMinimize={() => { setIsPomodoroOpen(false); setIsPomodoroMinimized(true); }}
        focusState={focusState}
        toggleFocus={toggleFocus}
        resetFocus={resetFocus}
      />
    </div>
  );
};

export default App;
