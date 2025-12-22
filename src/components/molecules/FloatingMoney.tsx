import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Box, Text } from '@/components/atoms';

type FloatingMoneyProps = {
  amount: number;
  onComplete?: () => void;
  type: 'gain' | 'loss';
  visible: boolean;
};

export const FloatingMoney: React.FC<FloatingMoneyProps> = ({
  amount,
  onComplete,
  type,
  visible,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Reset
      opacity.value = 0;
      translateY.value = 0;

      // Animate
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 600 }),
      );

      translateY.value = withTiming(-100, { duration: 800 });

      // Auto hide
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 800);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) {
    return null;
  }

  const isGain = type === 'gain';
  const sign = isGain ? '+' : '-';
  const color = isGain ? 'success' : 'danger';

  return (
    <Box pointerEvents="none" style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Text
          color={color}
          fontSize={18}
          fontWeight="800"
          style={styles.text}
          textAlign="center"
        >
          {sign}
          {Math.abs(amount)}xu 💰
        </Text>
      </Animated.View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 4,
  },
});
