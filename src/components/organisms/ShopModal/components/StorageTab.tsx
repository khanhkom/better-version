/**
 * StorageTab Component
 * Storage tab for selling harvested crops
 */

import type { Crop, CropId, Harvested } from '@/types/game';

import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { FloatingMoney } from '@/components/molecules/FloatingMoney';

import { CROPS } from '@/constants/game';

type StorageTabProps = {
  readonly harvested: Harvested;
  readonly onSellHarvest: (cropId: CropId) => void;
};

export function StorageTab({ harvested, onSellHarvest }: StorageTabProps) {
  const crops = Object.values(CROPS);
  const harvestedCrops = crops.filter((crop) => harvested[crop.id] > 0);
  const [selectedCrop, setSelectedCrop] = useState<Crop | undefined>(
    harvestedCrops[0]
  );
  const [floatingMoneyVisible, setFloatingMoneyVisible] = useState(false);
  const [floatingMoneyAmount, setFloatingMoneyAmount] = useState(0);

  if (harvestedCrops.length === 0) {
    return (
      <Box alignItems="center" height={160} padding="l">
        <Text color="textSecondary" fontSize={14} textAlign="center">
          📦 Empty storage
        </Text>
        <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
          Harvest crops to fill your storage
        </Text>
      </Box>
    );
  }

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
  };

  const handleSell = () => {
    if (selectedCrop && harvested[selectedCrop.id] > 0) {
      const revenue = selectedCrop.sellPrice;

      onSellHarvest(selectedCrop.id);

      // Show floating money animation
      setFloatingMoneyAmount(revenue);
      setFloatingMoneyVisible(true);
    }
  };

  const count = selectedCrop ? harvested[selectedCrop.id] : 0;
  const totalValue = selectedCrop ? count * selectedCrop.sellPrice : 0;

  return (
    <Box
      backgroundColor="farmCardBgLight"
      borderColor="farmBorder"
      borderRadius="m"
      borderWidth={2}
      gap="l"
      padding="m"
    >
      {/* Icon Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 120, minHeight: 120 }}
      >
        <Box flexDirection="row" flexWrap="wrap" gap="m" width={350}>
          {harvestedCrops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;

            return (
              <Pressable
                key={crop.id}
                onPress={() => { handleSelectCrop(crop); }}
              >
                <Box
                  alignItems="center"
                  backgroundColor={isSelected ? 'farmCardBgLight' : 'farmCardBgLight'}
                  borderColor={isSelected ? 'farmBorder' : 'farmCardBgLight'}
                  borderRadius="m"
                  borderWidth={isSelected ? 3 : 2}
                  height={56}
                  justifyContent="center"
                  position="relative"
                  width={56}
                >
                  <Emoji size={40} symbol={crop.icon} />
                  {harvested[crop.id] > 0 && (
                    <Box
                      alignItems="center"
                      backgroundColor="success"
                      borderRadius="full"
                      bottom={-4}
                      height={18}
                      justifyContent="center"
                      position="absolute"
                      right={-4}
                      width={18}
                    >
                      <Text color="white" fontSize={10} fontWeight="700">
                        {harvested[crop.id]}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Pressable>
            );
          })}
        </Box>
      </ScrollView>

      {/* Selected Item Details */}
      <Box backgroundColor="farmBorder" height={1} />
      {selectedCrop ? (
        <Box
          borderRadius="m"
          flexDirection="row"
          justifyContent="space-between"
        >
          <View>
            <Text color="textMuted" fontSize={16} fontWeight="700" mb="s">
              {selectedCrop.name}
            </Text>
            <Box gap="xxs">
              <Text color="textMuted" fontSize={12}>
                Giá bán: <Text color="highlightYellow" fontWeight="700">{selectedCrop.sellPrice}</Text> 💰 / 1
              </Text>
              <Text color="textMuted" fontSize={12}>
                Số lượng: <Text color="success" fontWeight="700">{count}</Text>
              </Text>
              <Text color="textMuted" fontSize={12}>
                Tổng: <Text color="gold" fontWeight="700">{totalValue}</Text> 💰
              </Text>
            </Box>
          </View>

          <Box justifyContent="flex-end">
            <Button
              borderRadius="s"
              disabled={count === 0}
              onPress={handleSell}
              paddingHorizontal="l"
              paddingVertical="s"
              title="Bán"
              variant="primary"
            />
          </Box>
        </Box>
      ) : undefined}

      {/* Floating Money Animation */}
      <FloatingMoney
        amount={floatingMoneyAmount}
        onComplete={() => {
          setFloatingMoneyVisible(false);
        }}
        type="gain"
        visible={floatingMoneyVisible}
      />
    </Box>
  );
}
