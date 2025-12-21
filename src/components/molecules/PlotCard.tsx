/**
 * PlotCard Component
 * Farm plot card with crop states and sway animation
 */

import type { LandPlot } from '@/types/game';

import { useEffect } from 'react';
import { ImageBackground, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { images } from '@/assets/images';
import { CROPS } from '@/constants/game';

const MAX_PROGRESS = 100;

type PlotCardProps = {
  readonly onPress: () => void;
  readonly plot: LandPlot;
  readonly testID?: string;
};

export function PlotCard({ onPress, plot, testID = undefined }: PlotCardProps) {
  const rotation = useSharedValue(0);

  // Sway animation for planted/ready crops
  useEffect(() => {
    rotation.value = (plot.status === 'PLANTED' || plot.status === 'READY')
      ? withRepeat(
        withTiming(5, { duration: 1000 }),
        -1, // Infinite
        true // Reverse
      )
      : withTiming(0, { duration: 300 });
  }, [plot.status, rotation]);

  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const crop = plot.cropId ? CROPS[plot.cropId] : undefined;

  return (
    <Pressable onPress={onPress} testID={testID}>
      <ImageBackground
        borderRadius={8}
        resizeMode="stretch"
        source={images.farm.oDat}
        style={{ borderRadius: 12, height: '100%', width: '100%' }}
      >
        <Card
          alignItems="center"
          backgroundColor="transparent"
          height="100%"
          justifyContent="center"
          width="100%"
        >
          {/* Empty plot */}
          {plot.status === 'EMPTY' && (
            <Box alignItems="center" opacity={0.5}>
              <Emoji size={24} symbol="🌱" />
            </Box>
          )}

          {/* Planted crop with progress */}
          {plot.status === 'PLANTED' && crop ? (
            <Box alignItems="center" width="100%">
              <Animated.View style={swayStyle}>
                <Emoji size={24} symbol={crop.icon} />
              </Animated.View>
              <Box mt="s" width="80%">
                {/* Custom progress bar */}
                <Box
                  backgroundColor="farmBorder"
                  borderRadius="full"
                  height={4}
                  overflow="hidden"
                >
                  <Box
                    backgroundColor="highlightYellow"
                    borderRadius="full"
                    height="100%"
                    width={`${Math.min(MAX_PROGRESS, Math.max(0, plot.progress))}%`}
                  />
                </Box>
              </Box>
            </Box>
          ) : undefined}

          {/* Ready to harvest */}
          {plot.status === 'READY' && crop ? (
            <Box alignItems="center">
              <Animated.View style={swayStyle}>
                <Emoji size={24} symbol={crop.icon} />
              </Animated.View>
              <Text color="highlightYellow" fontSize={10} fontWeight="700" mt="s">
                READY!
              </Text>
            </Box>
          ) : undefined}
        </Card>
      </ImageBackground>
    </Pressable>
  );
}
