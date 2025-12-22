
import React from 'react';
import { Home, ClipboardList, Store, Users, ShoppingBag, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', active: true, color: 'text-green-600' },
    { icon: ClipboardList, label: 'Quests', active: false, color: 'text-gray-400' },
    { icon: Store, label: 'Shop', active: false, color: 'text-gray-400' },
    { icon: Users, label: 'Friends', active: false, color: 'text-gray-400' },
    { icon: ShoppingBag, label: 'Bag', active: false, color: 'text-gray-400', badge: 1 },
    { icon: User, label: 'Potato', active: false, color: 'text-gray-400' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 pt-2 pb-6 flex justify-around items-end z-50 rounded-t-[32px] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item, idx) => (
        <button key={idx} className="flex flex-col items-center gap-1 group relative flex-1">
          {item.active && (
            <div className="absolute -top-3 w-12 h-12 bg-green-100 rounded-full -z-10 animate-pulse"></div>
          )}
          <div className="relative">
            <item.icon className={`w-6 h-6 transition-transform group-active:scale-90 ${item.active ? 'text-green-600' : 'text-gray-400'}`} />
            {item.badge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {item.badge}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-bold ${item.active ? 'text-green-600' : 'text-gray-400'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
