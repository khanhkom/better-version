
import React from 'react';
import { Weather } from '../types';

interface ParallaxBackgroundProps {
  weather: Weather;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ weather }) => {
  // Weather styles
  const styles = {
    sunny: {
      sky: 'from-[#87CEEB] to-[#E0F7FA]',
      farMtn: '#B2DFDB',
      midMtn: '#80CBC4',
      hill: '#4DB6AC',
      ground: '#97C578',
      celestial: 'bg-orange-400 blur-[3px] shadow-[0_0_60px_rgba(251,146,60,0.7)]',
      isDay: true,
    },
    rainy: {
      sky: 'from-[#4A5568] to-[#718096]',
      farMtn: '#2D3748',
      midMtn: '#4A5568',
      hill: '#2C7A7B',
      ground: '#688556',
      celestial: 'bg-gray-400 blur-[10px] opacity-20',
      isDay: true,
    },
    snowy: {
      sky: 'from-[#A0AEC0] to-[#E2E8F0]',
      farMtn: '#FFFFFF',
      midMtn: '#CBD5E0',
      hill: '#A0AEC0',
      ground: '#FFFFFF',
      celestial: 'bg-white blur-[5px] opacity-40',
      isDay: true,
    },
    night: {
      sky: 'from-[#0F172A] to-[#334155]',
      farMtn: '#1E293B',
      midMtn: '#0F172A',
      hill: '#1A365D',
      ground: '#2D3748',
      celestial: 'bg-gray-100 blur-[2px] shadow-[0_0_40px_rgba(255,255,255,0.4)]',
      isDay: false,
    }
  }[weather];

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b ${styles.sky} transition-colors duration-1000`}>
      
      {/* Stars (Only for Night) */}
      {weather === 'night' && (
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
           <div className="absolute top-40 left-60 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
           <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
           <div className="absolute bottom-60 left-10 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Sun/Moon */}
      <div className={`absolute top-12 right-12 w-24 h-24 rounded-full transition-all duration-1000 ${styles.celestial}`}></div>

      {/* 1. Far Mountains */}
      <div className="absolute bottom-0 w-[200%] h-full flex animate-scroll" style={{ animationDuration: '100s' }}>
        <div className="w-1/2 h-full relative">
          <svg className="absolute bottom-[25%] w-full h-[400px]" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <path d="M0,400 L0,220 L100,160 L250,240 L400,180 L600,260 L750,140 L900,220 L1000,200 L1000,400 Z" fill={styles.farMtn} className="transition-all duration-1000" opacity="0.3" />
          </svg>
        </div>
        <div className="w-1/2 h-full relative">
          <svg className="absolute bottom-[25%] w-full h-[400px]" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <path d="M0,400 L0,220 L100,160 L250,240 L400,180 L600,260 L750,140 L900,220 L1000,200 L1000,400 Z" fill={styles.farMtn} className="transition-all duration-1000" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* 2. Mid Mountains */}
      <div className="absolute bottom-0 w-[200%] h-full flex animate-scroll" style={{ animationDuration: '60s' }}>
        <div className="w-1/2 h-full relative">
          <svg className="absolute bottom-[12%] w-full h-[300px]" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <path d="M0,300 L0,180 Q150,80 300,160 T500,140 T700,180 T850,130 L1000,180 L1000,300 Z" fill={styles.midMtn} className="transition-all duration-1000" opacity="0.5" />
          </svg>
        </div>
        <div className="w-1/2 h-full relative">
          <svg className="absolute bottom-[12%] w-full h-[300px]" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <path d="M0,300 L0,180 Q150,80 300,160 T500,140 T700,180 T850,130 L1000,180 L1000,300 Z" fill={styles.midMtn} className="transition-all duration-1000" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* 3. Rolling Hills */}
      <div className="absolute bottom-0 w-[200%] h-full flex animate-scroll" style={{ animationDuration: '30s' }}>
        <div className="w-1/2 h-full relative">
          <svg className="absolute bottom-6 w-full h-[250px]" viewBox="0 0 1000 250" preserveAspectRatio="none">
            <path d="M0,250 L0,140 Q120,60 250,130 T450,100 T650,150 T850,110 T1000,150 L1000,250 Z" fill={styles.hill} className="transition-all duration-1000" />
          </svg>
        </div>
        <div className="w-1/2 h-full relative">
          <svg className="absolute bottom-6 w-full h-[250px]" viewBox="0 0 1000 250" preserveAspectRatio="none">
            <path d="M0,250 L0,140 Q120,60 250,130 T450,100 T650,150 T850,110 T1000,150 L1000,250 Z" fill={styles.hill} className="transition-all duration-1000" />
          </svg>
        </div>
      </div>

      {/* Rain/Snow Particles */}
      {(weather === 'rainy' || weather === 'snowy') && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="flex justify-around w-full h-full opacity-40">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className={`animate-bounce bg-white/50 transition-all ${weather === 'rainy' ? 'w-[1px] h-4' : 'w-2 h-2 rounded-full'}`}
                style={{ 
                  animationDuration: `${0.5 + Math.random()}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Foreground Grass & Path */}
      <div className="absolute bottom-0 w-[200%] h-[18%] flex animate-scroll" style={{ animationDuration: '12s' }}>
        <div className={`w-1/2 h-full transition-all duration-1000 relative border-t-[6px] shadow-inner`} style={{ backgroundColor: styles.ground, borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="absolute top-2 left-[15%] w-10 h-3 bg-black/5 rounded-full"></div>
          <div className="absolute top-8 left-[40%] w-14 h-4 bg-black/5 rounded-full"></div>
        </div>
        <div className={`w-1/2 h-full transition-all duration-1000 relative border-t-[6px] shadow-inner`} style={{ backgroundColor: styles.ground, borderColor: 'rgba(0,0,0,0.1)' }}>
          <div className="absolute top-2 left-[15%] w-10 h-3 bg-black/5 rounded-full"></div>
          <div className="absolute top-8 left-[40%] w-14 h-4 bg-black/5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxBackground;
