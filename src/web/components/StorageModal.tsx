
import React, { useState } from 'react';
import { GameState, Crop } from '../types';
import { CROPS } from '../constants';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  activeTab: 'shop' | 'items' | 'warehouse' | 'seeds';
  setActiveTab: (tab: 'shop' | 'items' | 'warehouse' | 'seeds') => void;
  onSell: (cropId: string) => void;
  onSelectSeed: (cropId: string) => void;
  onBuySeed: (cropId: string, currency: 'money' | 'diamonds', quantity: number) => void;
}

const StorageModal: React.FC<StorageModalProps> = ({
  isOpen,
  onClose,
  gameState,
  activeTab,
  setActiveTab,
  onSell,
  onSelectSeed,
  onBuySeed,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState(1);

  if (!isOpen) return null;

  const cropsList = Object.values(CROPS);
  const selectedCrop = selectedItemId ? CROPS[selectedItemId] : null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} Giây`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} Phút`;
    return `${Math.floor(seconds / 3600)} Giờ`;
  };

  const handleBuyClick = () => {
    if (selectedItemId) {
      setShowConfirm(true);
      setBuyQuantity(1);
    }
  };

  const renderShop = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Grid Area */}
        <div className="grid grid-cols-6 gap-2 p-2 overflow-y-auto min-h-[180px]">
          {cropsList.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedItemId(crop.id)}
              className={`aspect-square rounded-xl border-4 transition-all flex items-center justify-center text-4xl shadow-sm bg-blue-50/50 ${selectedItemId === crop.id ? 'border-orange-400 bg-white' : 'border-transparent hover:bg-white'}`}
            >
              {crop.icon}
            </button>
          ))}
          {/* Fill empty spots */}
          {Array.from({ length: Math.max(0, 12 - cropsList.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-blue-50/20 rounded-xl border-4 border-transparent"></div>
          ))}
        </div>

        {/* Info Area */}
        <div className="mt-4 border-t-2 border-blue-100 p-4 flex justify-between items-end bg-white rounded-b-2xl">
          <div className="space-y-1 text-blue-900 font-bold">
            {selectedCrop ? (
              <>
                <div className="text-xl text-blue-600">{selectedCrop.name}({formatTime(selectedCrop.growthTime)})</div>
                <div className="text-sm">Giá: <span className="text-blue-800">{selectedCrop.buyPrice}xu</span></div>
                <div className="text-sm">Cấp độ: <span className="text-blue-800">{selectedCrop.minLevel}</span></div>
                <div className="text-sm">Sản lượng: <span className="text-blue-800">{selectedCrop.yield}</span></div>
              </>
            ) : (
              <div className="text-blue-300 italic">Chọn một loại hạt giống</div>
            )}
          </div>
          <button 
            disabled={!selectedItemId || gameState.level < (selectedCrop?.minLevel || 0)}
            onClick={handleBuyClick}
            className={`px-8 py-2 rounded-xl text-white font-black text-xl shadow-lg border-2 border-white transition-all
              ${selectedItemId && gameState.level >= (selectedCrop?.minLevel || 0) 
                ? 'bg-yellow-500 hover:bg-yellow-600 active:scale-95' 
                : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Mua
          </button>
        </div>
      </div>
    );
  };

  const renderWarehouse = () => {
    const items = activeTab === 'warehouse' ? gameState.harvested : gameState.inventory;
    const itemIds = Object.keys(items).filter(id => items[id] > 0);
    const selectedObj = selectedItemId ? CROPS[selectedItemId] : null;
    const count = selectedItemId ? items[selectedItemId] || 0 : 0;

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-6 gap-2 p-2 overflow-y-auto min-h-[180px]">
          {itemIds.map(id => (
            <button
              key={id}
              onClick={() => setSelectedItemId(id)}
              className={`aspect-square rounded-xl border-4 transition-all flex items-center justify-center text-4xl shadow-sm bg-blue-50/50 ${selectedItemId === id ? 'border-orange-400 bg-white' : 'border-transparent hover:bg-white'}`}
            >
              {CROPS[id].icon}
              <span className="absolute bottom-1 right-1 text-[10px] bg-blue-600 text-white px-1 rounded">{items[id]}</span>
            </button>
          ))}
          {Array.from({ length: Math.max(0, 12 - itemIds.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-blue-50/20 rounded-xl border-4 border-transparent"></div>
          ))}
        </div>
        <div className="mt-4 border-t-2 border-blue-100 p-4 flex justify-between items-end bg-white rounded-b-2xl">
          <div className="space-y-1 text-blue-900 font-bold">
            <div className="text-xl text-blue-600">{selectedObj?.name || '---'}</div>
            <div className="text-sm">Số lượng: <span className="text-blue-800">{count}</span></div>
            {activeTab === 'warehouse' && (
              <div className="text-sm text-green-600">Tổng giá trị: {(count * (selectedObj?.sellPrice || 0))} xu</div>
            )}
          </div>
          {selectedItemId && (
            <button 
              onClick={() => activeTab === 'warehouse' ? onSell(selectedItemId) : (onSelectSeed(selectedItemId), onClose())}
              className="bg-yellow-500 border-2 border-white text-white font-black px-8 py-2 rounded-xl text-xl shadow-lg hover:bg-yellow-600 transition-all"
            >
              {activeTab === 'warehouse' ? 'Bán' : 'Trồng'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#56ccf2] w-full max-w-2xl rounded-[2.5rem] border-[8px] border-white shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in duration-300">
        
        {/* Currency Top Bar */}
        <div className="absolute top-4 right-12 flex gap-4 z-10">
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/50">
             <span className="text-yellow-400">🪙</span>
             <span className="text-white text-xs font-bold">{gameState.money.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/50">
             <span className="text-cyan-400">💎</span>
             <span className="text-white text-xs font-bold">{gameState.diamonds}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-xl z-20 hover:scale-110 transition-transform shadow-lg"
        >
          ✕
        </button>

        {/* Custom Tabs Bar */}
        <div className="flex gap-1 p-6 pb-0 overflow-x-auto">
          {[
            { id: 'shop', label: 'Giống' },
            { id: 'items', label: 'Vật Phẩm' },
            { id: 'warehouse', label: 'Kho hàng' },
            { id: 'seeds', label: 'Kho Giống' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSelectedItemId(null); }}
              className={`px-6 py-2 rounded-t-2xl font-black text-sm border-x-4 border-t-4 transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-400 border-blue-400 -translate-y-1' 
                  : 'bg-white/40 text-white border-transparent'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white m-6 mt-0 p-4 rounded-b-3xl flex-1 flex flex-col border-4 border-t-0 border-blue-400 shadow-inner min-h-[300px]">
          {activeTab === 'shop' ? renderShop() : renderWarehouse()}
        </div>

        {/* Purchase Confirmation Popup */}
        {showConfirm && selectedCrop && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-sm rounded-[2rem] border-4 border-[#56ccf2] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="text-center space-y-4">
                <div className="text-blue-900 font-bold text-lg px-4">
                  Bạn có muốn mua <span className="text-blue-500">{buyQuantity}</span> vật phẩm<br/>
                  <span className="text-orange-500">{selectedCrop.name}</span> với giá <span className="text-orange-500">{selectedCrop.buyPrice * buyQuantity} xu</span>?
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <button 
                    onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-full border-4 border-blue-400 flex items-center justify-center text-2xl font-black text-blue-500 hover:bg-blue-50"
                  >
                    -
                  </button>
                  <div className="w-24 h-12 rounded-xl border-4 border-blue-200 flex items-center justify-center text-2xl font-black text-blue-900 bg-blue-50">
                    {buyQuantity}
                  </div>
                  <button 
                    onClick={() => setBuyQuantity(q => q + 1)}
                    className="w-12 h-12 rounded-full border-4 border-blue-400 flex items-center justify-center text-2xl font-black text-blue-500 hover:bg-blue-50"
                  >
                    +
                  </button>
                </div>

                {/* Confirm Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => { onBuySeed(selectedCrop.id, 'money', buyQuantity); setShowConfirm(false); }}
                    className="flex-1 bg-yellow-500 text-white font-black py-3 rounded-xl border-2 border-white shadow-lg hover:bg-yellow-600 active:scale-95 transition-all"
                  >
                    Mua xu
                  </button>
                  <button 
                    onClick={() => { onBuySeed(selectedCrop.id, 'diamonds', buyQuantity); setShowConfirm(false); }}
                    className="flex-1 bg-cyan-500 text-white font-black py-3 rounded-xl border-2 border-white shadow-lg hover:bg-cyan-600 active:scale-95 transition-all"
                  >
                    Mua lượng
                  </button>
                </div>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full text-blue-400 font-bold hover:underline"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageModal;
