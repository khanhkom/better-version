/**
 * ShopModal Component
 * Shop system with 4 tabs: Seeds, Items, Storage, Seed Storage
 */

import type { CropId } from '@/types/game';

import { useState } from 'react';

import Box from '@/components/atoms/Box';
import { TabBar } from '@/components/molecules/TabBar';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { CROPS } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

import {
  ItemsTab,
  MoneyDisplay,
  SeedsTab,
  SeedStorageTab,
  StorageTab,
} from './components';

const DEFAULT_QUANTITY = 1;

type ShopModalProps = {
  readonly onClose: () => void;
  readonly visible: boolean;
};

type ShopTab = 'items' | 'seeds' | 'seedStorage' | 'storage';

export function ShopModal({ onClose, visible }: ShopModalProps) {
  const [activeTab, setActiveTab] = useState<ShopTab>('seeds');
  const money = useGameStore((state) => state.money);
  const inventory = useGameStore((state) => state.inventory);
  const harvested = useGameStore((state) => state.harvested);
  const buySeed = useGameStore((state) => state.buySeed);
  const sellHarvest = useGameStore((state) => state.sellHarvest);

  const tabs = [
    { id: 'seeds' as ShopTab, label: 'Giống' },
    { id: 'items' as ShopTab, label: 'Vật Phẩm' },
    { id: 'storage' as ShopTab, label: 'Kho hàng' },
    { id: 'seedStorage' as ShopTab, label: 'Kho Giống' },
  ];

  const handleBuySeed = (cropId: CropId) => {
    const crop = CROPS[cropId];
    if (money >= crop.buyPrice) {
      buySeed(cropId, DEFAULT_QUANTITY);
    }
  };

  const handleSellHarvest = (cropId: CropId) => {
    if (harvested[cropId] > 0) {
      sellHarvest(cropId, DEFAULT_QUANTITY);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as ShopTab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items': {
        return <ItemsTab />;
      }
      case 'seeds': {
        return <SeedsTab money={money} onBuySeed={handleBuySeed} />;
      }
      case 'seedStorage': {
        return <SeedStorageTab inventory={inventory} />;
      }
      case 'storage': {
        return <StorageTab harvested={harvested} onSellHarvest={handleSellHarvest} />;
      }
      default: {
        return undefined;
      }
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="🏪 Cửa hàng" visible={visible} width={380}>
      <MoneyDisplay money={money} />

      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      <Box mt="m">
        {renderTabContent()}
      </Box>
    </ModalWrapper>
  );
}
