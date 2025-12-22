/**
 * SeedsTab Component
 * Seeds shop tab for buying seeds
 */

import type { Crop, CropId } from '@/types/game';

import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';
import { QuantityModal } from '@/components/organisms/QuantityModal';

import { CROPS } from '@/constants/game';

const DISABLED_OPACITY = 0.5;
const SECONDS_PER_HOUR = 3600;

type SeedsTabProps = {
  readonly money: number;
  readonly onBuySeed: (cropId: CropId) => void;
};

export function SeedsTab({ money, onBuySeed }: SeedsTabProps) {
  const crops = Object.values(CROPS);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(crops[0] || null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
  };

  const handleBuyClick = () => {
    if (selectedCrop && money >= selectedCrop.buyPrice) {
      setShowQuantityModal(true);
    }
  };

  const handleConfirmBuy = (quantity: number) => {
    if (selectedCrop) {
      // Call onBuySeed multiple times or update to accept quantity
      for (let index = 0; index < quantity; index++) {
        onBuySeed(selectedCrop.id);
      }
      setShowQuantityModal(false);
    }
  };

  const handleCancelBuy = () => {
    setShowQuantityModal(false);
  };

  const canAfford = selectedCrop ? money >= selectedCrop.buyPrice : false;
  const profit = selectedCrop ? selectedCrop.sellPrice - selectedCrop.buyPrice : 0;
  const growthHours = selectedCrop ? Math.floor(selectedCrop.growthTime / SECONDS_PER_HOUR) : 0;
  const maxQuantity = selectedCrop ? Math.floor(money / selectedCrop.buyPrice) : 0;

  return (
    <Box backgroundColor="farmCardBgLight"
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
          {crops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
            const isAffordable = money >= crop.buyPrice;

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
                  opacity={isAffordable ? 1 : DISABLED_OPACITY}
                  width={56}
                >
                  <Emoji size={28} symbol={crop.icon} />
                </Box>
              </Pressable>
            );
          })}
        </Box>
      </ScrollView>

      {/* Selected Item Details */}
      <Box backgroundColor='farmBorder' height={1} />
      {selectedCrop ? <Box
        borderRadius="m"
        flexDirection="row"
        justifyContent="space-between"
      >
        <View>
          <Text color='textMuted' fontSize={16} fontWeight="700" mb="s">
            {selectedCrop.name}
          </Text>
          <Box gap="xxs">
            <Text color="textMuted" fontSize={12}>
              Giá mua: <Text color="highlightYellow" fontWeight="700">{selectedCrop.buyPrice}</Text> 💰
            </Text>
            <Text color="textMuted" fontSize={12}>
              Thời gian: <Text fontWeight="700">{growthHours}h</Text>
            </Text>
            <Text color="textMuted" fontSize={12}>
              Lợi nhuận: <Text color="success" fontWeight="700">+{profit}</Text> 💰
            </Text>
          </Box>
        </View>

        <Box justifyContent='flex-end'>
          <Button
            borderRadius='s'
            disabled={!canAfford}
            onPress={handleBuyClick}
            paddingHorizontal='l'
            paddingVertical='s'
            title="Mua"
            variant="primary"
          />
        </Box>
      </Box> : null}

      {/* Quantity Modal */}
      {selectedCrop ? (
        <QuantityModal
          itemName={selectedCrop.name}
          maxQuantity={maxQuantity}
          onCancel={handleCancelBuy}
          onConfirm={handleConfirmBuy}
          pricePerUnit={selectedCrop.buyPrice}
          visible={showQuantityModal}
        />
      ) : undefined}
    </Box>
  );
}
