# 08 - Shop & Inventory

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Status:** Draft

---

## ShopModal Structure

4 tabs:
1. **Giống** (Seeds) - Buy seeds
2. **Vật Phẩm** (Items) - Future expansion
3. **Kho hàng** (Harvested) - Sell crops
4. **Kho Giống** (Seed Inventory) - View owned seeds

---

## Implementation

```typescript
// src/components/modals/ShopModal.tsx
import React, { useState } from 'react';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';
import { TabBar } from '@/components/molecules/TabBar';
import { ShopGrid } from '@/components/organisms/ShopGrid';
import { InventoryGrid } from '@/components/organisms/InventoryGrid';
import { useGameStore } from '@/stores/gameStore';

type ShopModalProps = {
  visible: boolean;
};

export const ShopModal = ({ visible }: ShopModalProps) => {
  const [activeTab, setActiveTab] = useState('seeds');
  const closeModal = useGameStore((state) => state.closeModal);

  const tabs = [
    { id: 'seeds', label: 'Giống', icon: '🌱' },
    { id: 'items', label: 'Vật Phẩm', icon: '⚙️' },
    { id: 'harvested', label: 'Kho hàng', icon: '🌽' },
    { id: 'inventory', label: 'Kho Giống', icon: '📦' },
  ];

  return (
    <ModalWrapper visible={visible} onClose={closeModal} title="🏪 Cửa hàng">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'seeds' && <ShopGrid type="seeds" />}
      {activeTab === 'items' && <EmptyState message="Coming soon!" />}
      {activeTab === 'harvested' && <ShopGrid type="harvested" />}
      {activeTab === 'inventory' && <InventoryGrid type="seeds" />}
    </ModalWrapper>
  );
};
```

---

## ShopGrid Component

```typescript
// src/components/organisms/ShopGrid.tsx
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Box } from '@/components/atoms/Box';
import { ItemCard } from '@/components/molecules/ItemCard';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { useGameStore } from '@/stores/gameStore';
import { CROPS } from '@/constants/game';
import type { CropId } from '@/types/game';

type ShopGridProps = {
  type: 'seeds' | 'harvested';
};

export const ShopGrid = ({ type }: ShopGridProps) => {
  const [selectedCrop, setSelectedCrop] = useState<CropId | null>(null);
  const [quantity, setQuantity] = useState(1);

  const buySeed = useGameStore((state) => state.buySeed);
  const sellHarvest = useGameStore((state) => state.sellHarvest);
  const inventory = useGameStore((state) => state.inventory);
  const harvested = useGameStore((state) => state.harvested);
  const money = useGameStore((state) => state.money);

  const crops = Object.values(CROPS);

  const handleItemPress = (cropId: CropId) => {
    setSelectedCrop(cropId);
    setQuantity(1);
  };

  const handleConfirm = () => {
    if (!selectedCrop) return;

    if (type === 'seeds') {
      buySeed(selectedCrop, quantity);
    } else {
      sellHarvest(selectedCrop, quantity);
    }

    setSelectedCrop(null);
  };

  const getAvailableQuantity = (cropId: CropId) => {
    return type === 'seeds' ? 999 : harvested[cropId];
  };

  const getPrice = (cropId: CropId) => {
    const crop = CROPS[cropId];
    return type === 'seeds' ? crop.buyPrice : crop.sellPrice;
  };

  return (
    <>
      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const available = getAvailableQuantity(item.id);
          const price = getPrice(item.id);

          return (
            <Box flex={1}>
              <ItemCard
                icon={item.icon}
                label={item.name}
                quantity={available}
                badge={`${price}💰`}
                onPress={() => handleItemPress(item.id)}
                disabled={type === 'harvested' && available === 0}
              />
            </Box>
          );
        }}
      />

      {selectedCrop && (
        <ConfirmDialog
          visible={!!selectedCrop}
          title={type === 'seeds' ? 'Mua Giống' : 'Bán Hàng'}
          message={`${CROPS[selectedCrop].name}`}
          price={getPrice(selectedCrop) * quantity}
          quantity={quantity}
          maxQuantity={
            type === 'seeds'
              ? Math.floor(money / getPrice(selectedCrop))
              : getAvailableQuantity(selectedCrop)
          }
          onQuantityChange={setQuantity}
          onConfirm={handleConfirm}
          onCancel={() => setSelectedCrop(null)}
          confirmLabel={type === 'seeds' ? 'Mua' : 'Bán'}
        />
      )}
    </>
  );
};
```

---

## ConfirmDialog Component

```typescript
// src/components/molecules/ConfirmDialog.tsx
import React from 'react';
import { Modal } from 'react-native';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (qty: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
};

export const ConfirmDialog = ({
  visible,
  title,
  message,
  price,
  quantity,
  maxQuantity,
  onQuantityChange,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
}: ConfirmDialogProps) => (
  <Modal transparent visible={visible} animationType="fade">
    <Box
      flex={1}
      backgroundColor="rgba(0,0,0,0.7)"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        backgroundColor="farmCardBg"
        borderRadius="xl"
        borderWidth={4}
        borderColor="farmBorder"
        p="l"
        width="80%"
      >
        <Text variant="pixelHeader" fontSize={18} mb="m">
          {title}
        </Text>
        <Text variant="body" mb="m">
          {message}
        </Text>

        {/* Quantity Controls */}
        <Box flexDirection="row" alignItems="center" justifyContent="center" gap="m" mb="m">
          <Button
            variant="farmButton"
            onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <Text variant="pixelHeader" fontSize={24}>
            {quantity}
          </Text>
          <Button
            variant="farmButton"
            onPress={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
          >
            +
          </Button>
        </Box>

        <Text variant="farmLabel" textAlign="center" mb="l">
          Total: {price * quantity}💰
        </Text>

        {/* Actions */}
        <Box flexDirection="row" gap="m">
          <Button variant="danger" onPress={onCancel} flex={1}>
            Cancel
          </Button>
          <Button variant="success" onPress={onConfirm} flex={1} disabled={quantity === 0}>
            {confirmLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  </Modal>
);
```

---

## Next Steps

1. ⬜ Create ShopModal
2. ⬜ Create ShopGrid organism
3. ⬜ Create InventoryGrid organism
4. ⬜ Create ConfirmDialog molecule
5. ⬜ Test buy/sell transactions
6. ⬜ Test currency validation
