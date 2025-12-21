/**
 * SeedsTab Component
 * Seeds shop tab for buying seeds
 */

import type { CropId } from '@/types/game';

import { FlatList, Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { CROPS } from '@/constants/game';

const DISABLED_OPACITY = 0.5;

type SeedsTabProps = {
  readonly money: number;
  readonly onBuySeed: (cropId: CropId) => void;
};

export function SeedsTab({ money, onBuySeed }: SeedsTabProps) {
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
            onPress={() => { onBuySeed(item.id); }}
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
}
