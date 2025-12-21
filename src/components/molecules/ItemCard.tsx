import React from 'react';
import { Image, type ImageSourcePropType, TouchableOpacity } from 'react-native';
import Box from '../atoms/Box';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';
import type { Theme } from '@/theme/restyle';

interface ItemCardProps {
  image: ImageSourcePropType;
  name: string;
  status?: string;
  badgeCount?: number;
  isEquipped?: boolean;
  onPress?: () => void;
  borderColor?: keyof Theme['colors'];
}

const ItemCard: React.FC<ItemCardProps> = ({
  image,
  name,
  status,
  badgeCount,
  isEquipped = false,
  onPress,
  borderColor = 'borderDefault',
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box
        backgroundColor="cardPrimaryBackground"
        borderRadius="l"
        borderWidth={2}
        borderColor={borderColor}
        padding="l"
        width={140}
        alignItems="center"
      >
        <Box position="relative" marginBottom="m">
          <Box
            backgroundColor="cardBgLight"
            borderRadius="l"
            width={100}
            height={100}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Image
              source={image}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </Box>

          {isEquipped && (
            <Box
              position="absolute"
              top={-8}
              left={-8}
              backgroundColor="secondary"
              borderRadius="full"
              width={24}
              height={24}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={16}>⭐</Text>
            </Box>
          )}

          {badgeCount !== undefined && badgeCount > 0 && (
            <Box position="absolute" top={-8} right={-8}>
              <Badge count={badgeCount} />
            </Box>
          )}
        </Box>

        <Text variant="title" textAlign="center" marginBottom="xs">
          {name}
        </Text>

        {status && (
          <Text variant="caption" color="textSecondary" textAlign="center">
            {status}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default ItemCard;
