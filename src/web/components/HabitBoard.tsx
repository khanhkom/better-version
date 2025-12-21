
import React, { useState } from 'react';
import { Habit, HabitDifficulty } from '../types';
import { DIFFICULTY_SETTINGS } from '../constants';

interface HabitBoardProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onComplete: (habitId: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'xuReward' | 'xpReward' | 'completionHistory'>) => void;
}

const HabitBoard: React.FC<HabitBoardProps> = ({ isOpen, onClose, habits, onComplete, onAddHabit }) => {
  const [view, setView] = useState<'list' | 'add' | 'stats'>('list');
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📝');
  const [newTime, setNewTime] = useState('08:00');
  const [newDifficulty, setNewDifficulty] = useState<HabitDifficulty>('EASY');

  if (!isOpen) return null;

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (timestamp?: number) => {
    if (!timestamp) return false;
    return isSameDay(new Date(timestamp), new Date());
  };

  const getPast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const calculateStreak = (history: number[]) => {
    if (!history || history.length === 0) return 0;
    
    // Convert history to unique sorted dates (day strings)
    const completedDays = Array.from(new Set(history.map(ts => new Date(ts).toDateString())));
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let streak = 0;
    let checkDate = new Date();
    
    // If not completed today, check from yesterday
    if (!completedDays.includes(today.toDateString())) {
      checkDate = yesterday;
    }

    while (completedDays.includes(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddHabit({
      name: newName,
      icon: newIcon,
      time: newTime,
      difficulty: newDifficulty
    });
    setNewName('');
    setView('list');
  };

  const past7Days = getPast7Days();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#5d4037] w-full max-w-lg rounded-3xl border-[8px] border-[#3e2723] shadow-2xl flex flex-col relative p-1 overflow-hidden">
        
        {/* Header Tabs */}
        <div className="bg-[#8d6e63] border-b-4 border-[#3e2723]">
          <div className="flex justify-around p-2 gap-1">
            <button 
              onClick={() => setView('list')}
              className={`flex-1 py-2 pixel-font text-[8px] rounded-lg border-2 transition-all ${view === 'list' ? 'bg-[#ffb300] border-white text-[#3e2723]' : 'bg-[#3e2723]/20 text-white/60 border-transparent'}`}
            >
              Nhiệm Vụ
            </button>
            <button 
              onClick={() => setView('stats')}
              className={`flex-1 py-2 pixel-font text-[8px] rounded-lg border-2 transition-all ${view === 'stats' ? 'bg-[#ffb300] border-white text-[#3e2723]' : 'bg-[#3e2723]/20 text-white/60 border-transparent'}`}
            >
              Thống Kê
            </button>
            <button 
              onClick={() => setView('add')}
              className={`flex-1 py-2 pixel-font text-[8px] rounded-lg border-2 transition-all ${view === 'add' ? 'bg-[#ffb300] border-white text-[#3e2723]' : 'bg-[#3e2723]/20 text-white/60 border-transparent'}`}
            >
              + Thêm
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-[#d32f2f] text-white rounded-lg border-2 border-white font-bold flex items-center justify-center hover:bg-[#b71c1c] z-20"
        >
          ✕
        </button>

        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh] bg-[#a1887f]/30 min-h-[350px]">
          {view === 'list' && (
            habits.length > 0 ? habits.map((habit) => {
              const completed = isToday(habit.completedAt);
              const diff = DIFFICULTY_SETTINGS[habit.difficulty];
              return (
                <div 
                  key={habit.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-4 transition-all ${
                    completed 
                    ? 'bg-[#4e342e] border-[#3e2723] opacity-60' 
                    : 'bg-[#d7ccc8] border-[#8d6e63] hover:border-[#5d4037] shadow-md'
                  }`}
                >
                  <div className="text-2xl bg-white/50 p-2 rounded-lg">{habit.icon}</div>
                  
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${completed ? 'text-[#8d6e63] line-through' : 'text-[#3e2723]'}`}>
                      {habit.name} {habit.time && <span className="text-[10px] opacity-70">({habit.time})</span>}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[8px] font-bold uppercase ${diff.color}`}>{diff.label}</span>
                      <span className="text-[8px] font-bold text-yellow-700">+{habit.xuReward} Xu</span>
                      <span className="text-[8px] font-bold text-blue-700">+{habit.xpReward} XP</span>
                    </div>
                  </div>

                  <button
                    disabled={completed}
                    onClick={() => onComplete(habit.id)}
                    className={`
                      px-3 py-2 rounded-xl border-2 font-bold text-[10px] shadow-sm transition-all
                      ${completed 
                        ? 'bg-gray-500 border-gray-400 text-gray-200' 
                        : 'bg-[#4caf50] border-white text-white hover:bg-[#43a047]'
                      }
                    `}
                  >
                    {completed ? 'Xong' : 'Gieo'}
                  </button>
                </div>
              );
            }) : (
              <div className="text-center py-12 text-[#efebe9] italic text-sm">Chưa có thói quen nào.</div>
            )
          )}

          {view === 'stats' && (
            <div className="space-y-4">
              <div className="bg-[#3e2723]/30 p-2 rounded-lg flex justify-between text-[8px] text-[#efebe9] pixel-font uppercase px-4 mb-2">
                <span>Thói quen</span>
                <div className="flex gap-1">
                  {past7Days.map(d => (
                    <span key={d.toISOString()} className="w-4 text-center">{['CN','T2','T3','T4','T5','T6','T7'][d.getDay()]}</span>
                  ))}
                  <span className="w-8 ml-2">Chuỗi</span>
                </div>
              </div>
              
              {habits.map(habit => {
                const streak = calculateStreak(habit.completionHistory || []);
                const completedDates = (habit.completionHistory || []).map(ts => new Date(ts).toDateString());

                return (
                  <div key={habit.id} className="bg-[#d7ccc8] p-3 rounded-xl border-2 border-[#8d6e63] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{habit.icon}</span>
                      <span className="text-[10px] font-bold text-[#3e2723] truncate w-24">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {past7Days.map(day => {
                        const isDone = completedDates.includes(day.toDateString());
                        return (
                          <div 
                            key={day.toISOString()} 
                            className={`w-4 h-4 rounded-sm border ${isDone ? 'bg-[#4caf50] border-white' : 'bg-[#3e2723]/20 border-transparent'}`}
                            title={day.toLocaleDateString()}
                          />
                        );
                      })}
                      <div className="ml-2 flex items-center gap-1 bg-[#ffb300] px-2 py-0.5 rounded-full border border-[#3e2723] shadow-sm">
                        <span className="text-[10px]">🔥</span>
                        <span className="text-[10px] font-bold text-[#3e2723]">{streak}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-4 p-2">
              <div>
                <label className="block text-[#efebe9] text-[10px] font-bold mb-1 uppercase">Tên thói quen</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Tập Gym, Học Tiếng Anh..."
                  className="w-full bg-[#d7ccc8] border-2 border-[#8d6e63] p-2 rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#efebe9] text-[10px] font-bold mb-1 uppercase">Icon</label>
                  <input 
                    type="text" 
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full bg-[#d7ccc8] border-2 border-[#8d6e63] p-2 rounded-lg text-xl text-center"
                  />
                </div>
                <div>
                  <label className="block text-[#efebe9] text-[10px] font-bold mb-1 uppercase">Giờ nhắc</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[#d7ccc8] border-2 border-[#8d6e63] p-2 rounded-lg text-sm text-center"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#efebe9] text-[10px] font-bold mb-1 uppercase">Mức độ khó</label>
                <div className="flex gap-2">
                  {(['EASY', 'MEDIUM', 'HARD'] as HabitDifficulty[]).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setNewDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg border-2 font-bold text-[10px] transition-all ${
                        newDifficulty === d 
                        ? 'bg-[#ffb300] border-white text-[#3e2723]' 
                        : 'bg-[#d7ccc8] border-[#8d6e63] text-[#5d4037]'
                      }`}
                    >
                      {DIFFICULTY_SETTINGS[d].label}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#4caf50] text-white font-bold py-3 rounded-xl border-4 border-white shadow-lg hover:bg-[#43a047] active:scale-95 transition-all uppercase text-xs"
              >
                Gieo mầm thói quen
              </button>
            </form>
          )}
        </div>

        <div className="p-3 bg-[#8d6e63] border-t-4 border-[#3e2723] text-center">
          <p className="text-[#efebe9] text-[9px] italic">Duy trì chuỗi 🔥 để nhận thêm nhiều may mắn!</p>
        </div>
      </div>
    </div>
  );
};

export default HabitBoard;
