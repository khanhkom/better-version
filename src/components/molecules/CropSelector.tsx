/**
 * CropSelector Component
 * Modal for selecting crop to plant
 */

import type { CropId } from '@/types/game';

import { Check, X } from 'lucide-react-native';
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
  readonly selectedCropId?: CropId; // For continuous planting mode
  readonly visible: boolean;
};

export function CropSelector({
  onClose,
  onSelect,
  selectedCropId,
  visible,
}: CropSelectorProps) {
  const inventory = useGameStore((state) => state.inventory);
  const isContinuousMode = selectedCropId !== undefined;

  const handleSelect = (cropId: CropId) => {
    if (inventory[cropId] > 0) {
      onSelect(cropId);
      // Don't auto-close modal - let parent component handle closing
      // (parent will close for continuous mode, keep open otherwise)
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
                  {isContinuousMode ? '🌱 Gieo Liên Tục' : '🌱 Chọn Giống'}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Box
                    alignItems="center"
                    backgroundColor={isContinuousMode ? 'success' : 'danger'}
                    borderRadius="s"
                    justifyContent="center"
                    padding="xs"
                  >
                    {isContinuousMode ? (
                      <Check color="white" size={20} />
                    ) : (
                      <X color="white" size={20} />
                    )}
                  </Box>
                </TouchableOpacity>
              </Box>

              {/* Crop Grid */}
              <Box flexDirection="row" flexWrap="wrap" gap="m" justifyContent="flex-start">
                {Object.values(CROPS).map((crop) => {
                  const available = inventory[crop.id];
                  const isDisabled = available === 0;
                  const isSelected = isContinuousMode && selectedCropId === crop.id;

                  return (
                    <Pressable
                      disabled={isDisabled}
                      key={crop.id}
                      onPress={() => { handleSelect(crop.id); }}
                    >
                      <Box
                        alignItems="center"
                        backgroundColor={
                          isDisabled
                            ? 'cardBg'
                            : isSelected
                              ? 'highlightYellow'
                              : 'farmCardBgLight'
                        }
                        borderColor={
                          isDisabled
                            ? 'borderDefault'
                            : isSelected
                              ? 'farmBorder'
                              : 'farmBorder'
                        }
                        borderRadius="m"
                        borderWidth={isSelected ? 3 : 2}
                        height={48}
                        justifyContent="center"
                        opacity={isDisabled ? DISABLED_OPACITY : 1}
                        position="relative"
                        width={48}
                      >
                        <Emoji size={32} symbol={crop.icon} />
                        {available > 0 && (
                          <Box
                            alignItems="center"
                            backgroundColor="success"
                            borderRadius="full"
                            bottom={-4}
                            height={16}
                            justifyContent="center"
                            position="absolute"
                            right={-4}
                            width={16}
                          >
                            <Text color="white" fontSize={9} fontWeight="700">
                              {available}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    </Pressable>
                  );
                })}
              </Box>

              {/* Footer */}
              <Box alignItems="center" mt="m">
                <Text color="textSecondary" fontSize={11} textAlign="center">
                  {isContinuousMode
                    ? `Đã chọn: ${CROPS[selectedCropId].name} • Nhấn ô đất khác để gieo tiếp`
                    : 'Tap to plant • Buy more seeds in Shop 🏪'}
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
