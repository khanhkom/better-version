/**
 * CropSelector Component
 * Modal for selecting crop to plant
 */

import type { CropId } from '@/types/game';

import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { CROPS } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

const DISABLED_OPACITY = 0.5;

type CropSelectorProps = {
  readonly onClose: () => void;
  readonly onSelect: (cropId: CropId) => void;
  readonly visible: boolean;
};

export function CropSelector({
  onClose,
  onSelect,
  visible,
}: CropSelectorProps) {
  const inventory = useGameStore((state) => state.inventory);

  const handleSelect = (cropId: CropId) => {
    if (inventory[cropId] > 0) {
      onSelect(cropId);
      onClose();
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.backdrop}>
        <Box alignItems="center" flex={1} justifyContent="center">
          <Pressable onPress={(event) => { event.stopPropagation(); }}>
            <Card
              backgroundColor="farmCardBg"
              borderColor="farmBorderDark"
              borderRadius="xxl"
              borderWidth={8}
              padding="l"
              width={320}
            >
              {/* Header */}
              <Box
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                mb="m"
              >
                <Text fontSize={18} fontWeight="700" variant="pixelHeader">
                  🌱 Chọn Giống
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Box
                    alignItems="center"
                    backgroundColor="danger"
                    borderRadius="s"
                    justifyContent="center"
                    padding="xs"
                  >
                    <Text fontSize={16}>❌</Text>
                  </Box>
                </TouchableOpacity>
              </Box>

              {/* Crop Grid */}
              <Box flexDirection="row" flexWrap="wrap" gap="s">
                {Object.values(CROPS).map((crop) => {
                  const available = inventory[crop.id];
                  const isDisabled = available === 0;

                  return (
                    <Pressable
                      disabled={isDisabled}
                      key={crop.id}
                      onPress={() => { handleSelect(crop.id); }}
                      style={{ width: '48%' }}
                    >
                      <Card
                        alignItems="center"
                        backgroundColor={
                          isDisabled ? 'cardBg' : 'farmCardBgLight'
                        }
                        borderColor="farmBorder"
                        borderRadius="m"
                        borderWidth={2}
                        opacity={isDisabled ? DISABLED_OPACITY : 1}
                        padding="m"
                      >
                        <Emoji size={40} symbol={crop.icon} />
                        <Text
                          fontSize={12}
                          fontWeight="600"
                          mt="xs"
                          textAlign="center"
                        >
                          {crop.name}
                        </Text>
                        <Text
                          color={available > 0 ? 'success' : 'danger'}
                          fontSize={11}
                          fontWeight="700"
                          mt="xs"
                        >
                          {available} seeds
                        </Text>
                        <Text color="textSecondary" fontSize={10} mt="xs">
                          {crop.buyPrice}💰
                        </Text>
                      </Card>
                    </Pressable>
                  );
                })}
              </Box>

              {/* Footer */}
              <Box alignItems="center" mt="m">
                <Text color="textSecondary" fontSize={11} textAlign="center">
                  Tap to plant • Buy more seeds in Shop 🏪
                </Text>
              </Box>
            </Card>
          </Pressable>
        </Box>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
  },
});
