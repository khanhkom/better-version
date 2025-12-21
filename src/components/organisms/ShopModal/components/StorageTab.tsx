/**
 * StorageTab Component
 * Storage tab for selling harvested crops
 */

import type { CropId, Harvested } from '@/types/game';

import { FlatList, Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { CROPS } from '@/constants/game';

type StorageTabProps = {
  readonly harvested: Harvested;
  readonly onSellHarvest: (cropId: CropId) => void;
};

export function StorageTab({ harvested, onSellHarvest }: StorageTabProps) {
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
            onPress={() => { onSellHarvest(item.id); }}
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
}
