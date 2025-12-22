
import React, { useState, useEffect } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import Character from './components/Character';
import { Settings, RefreshCw, X, Sun, CloudRain, Snowflake, Moon, Quote } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Weather } from './types';

const App: React.FC = () => {
  const [quote, setQuote] = useState("Your pet is enjoying the beautiful scenery!");
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [weather, setWeather] = useState<Weather>('sunny');
  const [showSettings, setShowSettings] = useState(false);

  const fetchEncouragement = async () => {
    setLoadingQuote(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me a very short, cute, one-sentence encouraging message from a small pet bird to its owner. The current weather is ${weather}.`,
      });
      if (response.text) {
        setQuote(response.text.trim());
      }
    } catch (error) {
      console.error("Failed to fetch quote", error);
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    fetchEncouragement();
  }, [weather]);

  const weatherOptions: { id: Weather; icon: any; label: string; color: string }[] = [
    { id: 'sunny', icon: Sun, label: 'Sunny', color: 'bg-yellow-400' },
    { id: 'rainy', icon: CloudRain, label: 'Rainy', color: 'bg-blue-400' },
    { id: 'snowy', icon: Snowflake, label: 'Snowy', color: 'bg-indigo-200' },
    { id: 'night', icon: Moon, label: 'Night', color: 'bg-purple-900' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-900 overflow-hidden relative shadow-2xl">
      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 z-50 flex flex-col gap-3">
         <button 
           onClick={() => setShowSettings(true)}
           className="bg-white/30 p-3 rounded-2xl backdrop-blur-lg shadow-lg hover:bg-white/50 transition-colors"
         >
           <Settings className="text-white w-6 h-6" />
         </button>
         <button 
           onClick={fetchEncouragement}
           className="bg-white/30 p-3 rounded-2xl backdrop-blur-lg shadow-lg hover:bg-white/50 transition-colors"
         >
           <RefreshCw className={`text-white w-6 h-6 ${loadingQuote ? 'animate-spin' : ''}`} />
         </button>
      </div>

      {/* Weather Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Environment</h2>
            <div className="grid grid-cols-2 gap-4">
              {weatherOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setWeather(opt.id);
                    setShowSettings(false);
                  }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all border-2 ${
                    weather === opt.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${opt.color} text-white`}>
                    <opt.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Adventure Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        <ParallaxBackground weather={weather} />
        
        {/* Centered Quote Bubble */}
        <div className="absolute top-[30%] left-6 right-6 z-40 flex justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-[2.5rem] shadow-2xl border border-white/40 max-w-xs text-center relative animate-fade-in pointer-events-auto">
             {/* Decorative Quote Icon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-400 p-2 rounded-full shadow-lg">
              <Quote className="w-4 h-4 text-white fill-current" />
            </div>
            
            <p className="text-gray-800 font-bold text-lg leading-relaxed italic">
              {loadingQuote ? "Birdie is thinking..." : `"${quote}"`}
            </p>
            
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45 border-r border-b border-white/40"></div>
          </div>
        </div>

        {/* The Character */}
        <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 z-30 scale-125">
          <Character weather={weather} />
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
