/**
 * CropToolbar Component
 * Bottom toolbar for selecting crop to plant continuously
 */

import type { CropId } from '@/types/game';

import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { CROPS } from '@/constants/game';
import { useGameStore } from '@/stores/gameStore';

const DISABLED_OPACITY = 0.5;
const SELECTED_SCALE = 1.15;
const DEFAULT_SCALE = 1;

type CropToolbarProps = {
  readonly onSelect: (cropId: CropId | null) => void;
  readonly selectedCrop: CropId | null;
};

export function CropToolbar({ onSelect, selectedCrop }: CropToolbarProps) {
  const inventory = useGameStore((state) => state.inventory);

  return (
    <Box
      bottom={0}
      left={0}
      paddingBottom="l"
      paddingHorizontal="m"
      position="absolute"
      right={0}
    >
      <Card
        backgroundColor="farmCardBg"
        borderColor="farmBorderDark"
        borderRadius="xxl"
        borderWidth={4}
        padding="m"
      >
        {/* Header */}
        <Box alignItems="center" mb="s">
          <Text fontSize={14} fontWeight="700" variant="pixelHeader">
            🌱 Chọn Giống Để Gieo
          </Text>
        </Box>

        {/* Crop Grid */}
        <Box flexDirection="row" gap="m" justifyContent="center">
          {/* Clear Selection Button */}
          <Pressable onPress={() => { onSelect(null); }}>
            <Box
              alignItems="center"
              backgroundColor={selectedCrop === null ? 'highlightYellow' : 'farmCardBgLight'}
              borderColor={selectedCrop === null ? 'farmBorder' : 'borderDefault'}
              borderRadius="m"
              borderWidth={selectedCrop === null ? 3 : 2}
              height={56}
              justifyContent="center"
              width={56}
            >
              <Emoji size={32} symbol="✋" />
              <Text fontSize={8} fontWeight="700" mt="xs">
                Huỷ
              </Text>
            </Box>
          </Pressable>

          {/* Crop Options */}
          {Object.values(CROPS).map((crop) => {
            const available = inventory[crop.id];
            const isDisabled = available === 0;
            const isSelected = selectedCrop === crop.id;

            return (
              <CropButton
                available={available}
                cropIcon={crop.icon}
                isDisabled={isDisabled}
                isSelected={isSelected}
                key={crop.id}
                onPress={() => {
                  if (!isDisabled) {
                    onSelect(crop.id);
                  }
                }}
              />
            );
          })}
        </Box>

        {/* Footer */}
        <Box alignItems="center" mt="s">
          <Text color="textSecondary" fontSize={10} textAlign="center">
            {selectedCrop
              ? `✓ ${CROPS[selectedCrop].name} đã chọn - Nhấn vào ô đất để gieo`
              : 'Chọn giống để gieo liên tục'}
          </Text>
        </Box>
      </Card>
    </Box>
  );
}

type CropButtonProps = {
  readonly available: number;
  readonly cropIcon: string;
  readonly isDisabled: boolean;
  readonly isSelected: boolean;
  readonly onPress: () => void;
};

function CropButton({
  available,
  cropIcon,
  isDisabled,
  isSelected,
  onPress
}: CropButtonProps) {
  const scale = useSharedValue(DEFAULT_SCALE);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!isDisabled) {
      scale.value = withSpring(isSelected ? DEFAULT_SCALE : SELECTED_SCALE, {
        damping: 10,
        stiffness: 200,
      });
      onPress();
    }
  };

  // Update scale when selection changes
  if (isSelected) {
    scale.value = withSpring(SELECTED_SCALE, {
      damping: 10,
      stiffness: 200,
    });
  } else {
    scale.value = withSpring(DEFAULT_SCALE, {
      damping: 10,
      stiffness: 200,
    });
  }

  return (
    <Pressable disabled={isDisabled} onPress={handlePress}>
      <Animated.View style={animatedStyle}>
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
                : 'borderDefault'
          }
          borderRadius="m"
          borderWidth={isSelected ? 3 : 2}
          height={56}
          justifyContent="center"
          opacity={isDisabled ? DISABLED_OPACITY : 1}
          position="relative"
          width={56}
        >
          <Emoji size={32} symbol={cropIcon} />
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
      </Animated.View>
    </Pressable>
  );
}
