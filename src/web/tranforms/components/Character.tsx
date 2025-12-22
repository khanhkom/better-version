
import React from 'react';
import { Weather } from '../types';

interface CharacterProps {
  weather?: Weather;
}

const Character: React.FC<CharacterProps> = ({ weather = 'sunny' }) => {
  return (
    <div className="relative group cursor-pointer animate-bounce" style={{ animationDuration: '2s' }}>
      {/* Character Main Body */}
      <div className={`w-24 h-24 rounded-[3rem] relative shadow-lg transition-colors duration-500 ${weather === 'night' ? 'bg-indigo-300' : 'bg-pink-300'}`}>
        
        {/* Eye */}
        <div className="absolute top-6 right-6 w-3 h-3 bg-gray-800 rounded-full"></div>
        {/* Beak */}
        <div className="absolute top-8 -right-2 w-4 h-3 bg-yellow-400 rounded-full"></div>
        
        {/* Raincoat/Hoodie Overlay */}
        {weather === 'rainy' && (
          <div className="absolute inset-0 bg-yellow-300/80 rounded-[3rem] border-2 border-yellow-400">
            <div className="absolute -top-1 left-4 w-16 h-8 bg-yellow-300 rounded-full border-t-2 border-yellow-400"></div>
            {/* Peeking Eye */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-gray-800 rounded-full z-10"></div>
          </div>
        )}

        {/* Scarf for Snowy */}
        {weather === 'snowy' && (
          <div className="absolute bottom-6 left-0 w-full h-6 bg-red-500 rounded-full z-10 shadow-sm">
            <div className="absolute top-2 -right-2 w-6 h-10 bg-red-600 rounded-lg rotate-12"></div>
          </div>
        )}

        {/* Backpack */}
        <div className={`absolute top-10 -left-4 w-12 h-12 rounded-2xl rotate-12 shadow-md transition-colors ${weather === 'rainy' ? 'bg-yellow-600' : 'bg-red-500'}`}></div>
        
        {/* Wing */}
        <div className={`absolute top-10 left-6 w-10 h-6 rounded-full animate-pulse ${weather === 'night' ? 'bg-indigo-400' : 'bg-pink-400'}`}></div>
        
        {/* Feet */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gray-400 rounded-full"></div>
        <div className="absolute -bottom-2 left-12 w-4 h-4 bg-gray-400 rounded-full"></div>
      </div>
      
      {/* Speech Bubble on Hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {weather === 'rainy' ? 'Splish splash!' : weather === 'snowy' ? 'Brrr, so pretty!' : "Let's keep moving!"}
      </div>
    </div>
  );
};

export default Character;
