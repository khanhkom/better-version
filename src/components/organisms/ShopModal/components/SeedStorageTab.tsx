/**
 * SeedStorageTab Component
 * Seed storage tab for viewing owned seeds
 */

import type { Crop, Inventory } from '@/types/game';

import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

import Box from '@/components/atoms/Box';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { CROPS } from '@/constants/game';

const SECONDS_PER_HOUR = 3600;

type SeedStorageTabProps = {
  readonly inventory: Inventory;
};

export function SeedStorageTab({ inventory }: SeedStorageTabProps) {
  const crops = Object.values(CROPS);
  const ownedSeeds = crops.filter((crop) => inventory[crop.id] > 0);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(
    ownedSeeds[0] || null
  );

  if (ownedSeeds.length === 0) {
    return (
      <Box alignItems="center" padding="l">
        <Text color="textMuted" fontSize={14} textAlign="center">
          🌾 No seeds in storage
        </Text>
        <Text color="textMuted" fontSize={11} mt="xs" textAlign="center">
          Buy seeds from the Seeds tab
        </Text>
      </Box>
    );
  }

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
  };

  const count = selectedCrop ? inventory[selectedCrop.id] : 0;

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
          {ownedSeeds.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;

            return (
              <Pressable
                key={crop.id}
                onPress={() => { handleSelectCrop(crop); }}
              >
                <Box
                  alignItems="center"
                  backgroundColor={isSelected ? 'farmCardBgLight' : 'cardBg'}
                  borderColor={isSelected ? 'farmBorder' : 'borderDefault'}
                  borderRadius="m"
                  borderWidth={isSelected ? 3 : 2}
                  height={56}
                  justifyContent="center"
                  position="relative"
                  width={56}
                >
                  <Emoji size={32} symbol={crop.icon} />
                  {inventory[crop.id] > 0 && (
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
                        {inventory[crop.id]}
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
      {selectedCrop ? <Box>
        <Text color="textMuted" fontSize={16} fontWeight="700" mb="s">
          {selectedCrop.name}
        </Text>
        <Box gap="xs">
          <Text color="textMuted" fontSize={12}>
            Số lượng: <Text color="success" fontWeight="700">{count}</Text> hạt giống
          </Text>
          <Text color="textMuted" fontSize={12}>
            Thời gian trồng: <Text fontWeight="700">{Math.floor(selectedCrop.growthTime / SECONDS_PER_HOUR)}h</Text>
          </Text>
          <Text color="textMuted" fontSize={12}>
            Cấp độ: <Text fontWeight="700">{selectedCrop.level}</Text>
          </Text>
        </Box>
      </Box> : null}
    </Box>
  );
}
