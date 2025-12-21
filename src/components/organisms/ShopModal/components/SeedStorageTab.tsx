/**
 * SeedStorageTab Component
 * Seed storage tab for viewing owned seeds
 */

import type { Inventory } from '@/types/game';

import { FlatList } from 'react-native';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
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

  if (ownedSeeds.length === 0) {
    return (
      <Box alignItems="center" padding="l">
        <Text color="textSecondary" fontSize={14} textAlign="center">
          🌾 No seeds in storage
        </Text>
        <Text color="textSecondary" fontSize={11} mt="xs" textAlign="center">
          Buy seeds from the Seeds tab
        </Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={ownedSeeds}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => {
        const count = inventory[item.id];

        return (
          <Box style={{ margin: '1%', width: '48%' }}>
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
                {count} seeds
              </Text>
              <Text color="textSecondary" fontSize={10} mt="xs">
                Growth: {Math.floor(item.growthTime / SECONDS_PER_HOUR)}h
              </Text>
            </Card>
          </Box>
        );
      }}
      showsVerticalScrollIndicator={false}
      style={{ maxHeight: 400 }}
    />
  );
}
