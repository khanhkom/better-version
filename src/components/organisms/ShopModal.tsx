/**
 * ShopModal Component
 * Shop system with 4 tabs: Seeds, Items, Storage, Seed Storage
 */

import type { CropId } from '@/types/game';

import { useState } from 'react';
import { FlatList, Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';
import { TabBar } from '@/components/molecules/TabBar';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

import { CROPS } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

const DISABLED_OPACITY = 0.5;
const SECONDS_PER_HOUR = 3600;
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
    { id: 'seeds' as ShopTab, label: '🌱 Giống' },
    { id: 'items' as ShopTab, label: '🛠️ Vật Phẩm' },
    { id: 'storage' as ShopTab, label: '📦 Kho hàng' },
    { id: 'seedStorage' as ShopTab, label: '🌾 Kho Giống' },
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

  const renderSeedsTab = () => {
    const crops = Object.values(CROPS);

    return (
      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          const canAfford = money >= item.buyPrice;
          return (
            <Pressable
              disabled={!canAfford}
              onPress={() => { handleBuySeed(item.id); }}
              style={{ margin: '1%', width: '48%' }}
            >
              <Card
                alignItems="center"
                backgroundColor={canAfford ? 'farmCardBgLight' : 'cardBg'}
                borderColor="farmBorder"
                borderRadius="m"
                borderWidth={2}
                opacity={canAfford ? 1 : DISABLED_OPACITY}
                padding="m"
              >
                <Emoji size={40} symbol={item.icon} />
                <Text fontSize={12} fontWeight="600" mt="xs" textAlign="center">
                  {item.name}
                </Text>
                <Box flexDirection="row" gap="xs" mt="xs">
                  <Text color="highlightYellow" fontSize={11} fontWeight="700">
                    💰 {item.buyPrice}
                  </Text>
                </Box>
                <Text color="textSecondary" fontSize={10} mt="xs">
                  +{item.xpReward} XP
                </Text>
              </Card>
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      />
    );
  };

  const renderItemsTab = () => (
    <Box alignItems="center" padding="l">
      <Text color="textSecondary" fontSize={14} textAlign="center">
        🛠️ Coming soon...
      </Text>
      <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
        Tools and upgrades will be available here
      </Text>
    </Box>
  );

  const renderStorageTab = () => {
    const crops = Object.values(CROPS);
    const harvestedCrops = crops.filter((crop) => harvested[crop.id] > 0);

    if (harvestedCrops.length === 0) {
      return (
        <Box alignItems="center" padding="l">
          <Text color="textSecondary" fontSize={14} textAlign="center">
            📦 Empty storage
          </Text>
          <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
            Harvest crops to fill your storage
          </Text>
        </Box>
      );
    }

    return (
      <FlatList
        data={harvestedCrops}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          const count = harvested[item.id];
          const totalValue = count * item.sellPrice;

          return (
            <Pressable
              onPress={() => { handleSellHarvest(item.id); }}
              style={{ margin: '1%', width: '48%' }}
            >
              <Card
                alignItems="center"
                backgroundColor="farmCardBgLight"
                borderColor="farmBorder"
                borderRadius="m"
                borderWidth={2}
                padding="m"
              >
                <Emoji size={40} symbol={item.icon} />
                <Text fontSize={12} fontWeight="600" mt="xs" textAlign="center">
                  {item.name}
                </Text>
                <Text color="success" fontSize={11} fontWeight="700" mt="xs">
                  {count} units
                </Text>
                <Box flexDirection="row" gap="xs" mt="xs">
                  <Text color="highlightYellow" fontSize={10}>
                    Sell: 💰 {item.sellPrice} each
                  </Text>
                </Box>
                <Text color="gold" fontSize={10} fontWeight="700" mt="xs">
                  Total: 💰 {totalValue}
                </Text>
              </Card>
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      />
    );
  };

  const renderSeedStorageTab = () => {
    const crops = Object.values(CROPS);
    const ownedSeeds = crops.filter((crop) => inventory[crop.id] > 0);

    if (ownedSeeds.length === 0) {
      return (
        <Box alignItems="center" padding="l">
          <Text color="textSecondary" fontSize={14} textAlign="center">
            🌾 No seeds in storage
          </Text>
          <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
            Buy seeds from the Seeds tab
          </Text>
        </Box>
      );
    }

    return (
      <FlatList
        data={ownedSeeds}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          const count = inventory[item.id];

          return (
            <Box style={{ margin: '1%', width: '48%' }}>
              <Card
                alignItems="center"
                backgroundColor="farmCardBgLight"
                borderColor="farmBorder"
                borderRadius="m"
                borderWidth={2}
                padding="m"
              >
                <Emoji size={40} symbol={item.icon} />
                <Text fontSize={12} fontWeight="600" mt="xs" textAlign="center">
                  {item.name}
                </Text>
                <Text color="success" fontSize={11} fontWeight="700" mt="xs">
                  {count} seeds
                </Text>
                <Text color="textSecondary" fontSize={10} mt="xs">
                  Growth: {Math.floor(item.growthTime / SECONDS_PER_HOUR)}h
                </Text>
              </Card>
            </Box>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items': {
        return renderItemsTab();
      }
      case 'seeds': {
        return renderSeedsTab();
      }
      case 'seedStorage': {
        return renderSeedStorageTab();
      }
      case 'storage': {
        return renderStorageTab();
      }
      default: {
        return undefined;
      }
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="🏪 Cửa hàng" visible={visible} width={380}>
      {/* Money Display */}
      <Box
        alignItems="center"
        backgroundColor="farmCardBgLight"
        borderRadius="m"
        flexDirection="row"
        gap="m"
        justifyContent="center"
        mb="m"
        padding="m"
      >
        <Text fontSize={14} fontWeight="700">
          💰 {money}
        </Text>
      </Box>

      {/* Tab Navigation */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      {/* Tab Content */}
      <Box mt="m">
        {renderTabContent()}
      </Box>
    </ModalWrapper>
  );
}
