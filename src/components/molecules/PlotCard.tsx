/**
 * PlotCard Component
 * Farm plot card with crop states and sway animation
 */

import type { LandPlot } from '@/types/game';

import { useEffect, useState } from 'react';
import { ImageBackground, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';

import { images } from '@/assets/images';
import { CROPS } from '@/constants/game';

const MAX_PROGRESS = 100;
const BOUNCE_SCALE = 1.1;
const JUMP_SCALE = 1.2;
const SHRINK_SCALE = 0.8;
const JUMP_HEIGHT = -60;
const REWARD_FLOAT_HEIGHT = -80;

type PlotCardProps = {
  readonly onPress: () => void;
  readonly plot: LandPlot;
  readonly testID?: string;
};

export function PlotCard({ onPress, plot, testID = undefined }: PlotCardProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const bounceScale = useSharedValue(1);
  const rewardOpacity = useSharedValue(0);
  const rewardTranslateY = useSharedValue(0);
  const [isHarvesting, setIsHarvesting] = useState(false);

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

  // Bounce animation for ready crops
  useEffect(() => {
    bounceScale.value = plot.status === 'READY'
      ? withRepeat(
          withSequence(
            withSpring(BOUNCE_SCALE, { damping: 2, stiffness: 100 }),
            withSpring(1, { damping: 2, stiffness: 100 })
          ),
          -1,
          false
        )
      : withTiming(1, { duration: 200 });
  }, [plot.status, bounceScale]);

  // Harvest animation trigger
  const handlePress = () => {
    if (plot.status === 'READY') {
      setIsHarvesting(true);

      // Animate crop jumping up and fading
      translateY.value = withTiming(JUMP_HEIGHT, { duration: 600 });
      scale.value = withSequence(
        withSpring(JUMP_SCALE, { damping: 8 }),
        withTiming(SHRINK_SCALE, { duration: 400 })
      );
      opacity.value = withTiming(0, { duration: 600 });

      // Animate reward text appearing and floating up
      rewardOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 400 })
      );
      rewardTranslateY.value = withTiming(REWARD_FLOAT_HEIGHT, { duration: 600 }, () => {
        'worklet';
        runOnJS(setIsHarvesting)(false);
        runOnJS(onPress)();
      });
    } else {
      onPress();
    }
  };

  // Reset animation when plot changes
  useEffect(() => {
    if (!isHarvesting) {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
      rewardOpacity.value = 0;
      rewardTranslateY.value = 0;
    }
  }, [plot.status, isHarvesting, scale, opacity, translateY, rewardOpacity, rewardTranslateY]);

  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const harvestStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const rewardStyle = useAnimatedStyle(() => ({
    opacity: rewardOpacity.value,
    transform: [{ translateY: rewardTranslateY.value }],
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bounceScale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const crop = plot.cropId ? CROPS[plot.cropId] : undefined;

  return (
    <Pressable onPress={handlePress} testID={testID}>
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
              <Animated.View style={isHarvesting ? harvestStyle : bounceStyle}>
                <Emoji size={24} symbol={crop.icon} />
              </Animated.View>
              {isHarvesting ? (
                <Animated.View style={[rewardStyle, { position: 'absolute', top: 30 }]}>
                  <Text color="success" fontSize={12} fontWeight="800">
                    +{crop.sellPrice} 🪙
                  </Text>
                </Animated.View>
              ) : (
                <Text color="highlightYellow" fontSize={10} fontWeight="700" mt="s">
                  READY!
                </Text>
              )}
            </Box>
          ) : undefined}
        </Card>
      </ImageBackground>
    </Pressable>
  );
}
