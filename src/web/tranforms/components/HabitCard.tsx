
import React from 'react';
import { Habit } from '../types';
import { Check, Zap, MoreVertical } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle }) => {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300 ${
      habit.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-50 shadow-sm'
    }`}>
      <div className="p-1 text-gray-400">
        <MoreVertical className="w-5 h-5" />
      </div>
      
      <div className="w-12 h-12 flex items-center justify-center bg-pink-50 rounded-2xl text-2xl">
        {habit.icon}
      </div>

      <div className="flex-1">
        <h3 className={`font-bold ${habit.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {habit.title}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs font-bold text-orange-400">{habit.energyReward}</span>
          <Zap className="w-3 h-3 text-orange-400 fill-current" />
        </div>
      </div>

      <button 
        onClick={onToggle}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          habit.completed 
            ? 'bg-green-500 text-white shadow-[0_4px_0_rgb(21,128,61)]' 
            : 'bg-gray-100 text-transparent border-2 border-gray-200'
        }`}
      >
        <Check className={`w-6 h-6 ${habit.completed ? 'opacity-100' : 'opacity-0'}`} />
      </button>
    </div>
  );
};

export default HabitCard;
