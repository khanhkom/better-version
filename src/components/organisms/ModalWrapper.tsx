/**
 * ModalWrapper Component
 * Reusable modal container with blur backdrop and animations
 */

import { BlurView } from '@react-native-community/blur';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Box from '@/components/atoms/Box';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';

const DEFAULT_MODAL_WIDTH = 360;
const INITIAL_SCALE = 0.8;

type ModalWrapperProps = {
  readonly children: React.ReactNode;
  readonly onClose: () => void;
  readonly title?: string;
  readonly visible: boolean;
  readonly width?: number;
};

export function ModalWrapper({
  children,
  onClose,
  title = undefined,
  visible,
  width = DEFAULT_MODAL_WIDTH,
}: ModalWrapperProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(INITIAL_SCALE);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 80 });
      scale.value = withSpring(1, { damping: 25, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 60 });
      scale.value = withTiming(INITIAL_SCALE, { duration: 60 });
    }
  }, [visible, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <BlurView blurAmount={10} blurType="dark" style={styles.backdrop}>
        <Pressable onPress={onClose} style={styles.backdrop}>
          <Box alignItems="center" flex={1} justifyContent="center">
            <Pressable onPress={(event) => { event.stopPropagation(); }}>
              <Animated.View style={animatedStyle}>
                <Card
                  backgroundColor="farmCardBg"
                  borderColor="farmBorderDark"
                  borderRadius="xxl"
                  borderWidth={8}
                  padding="l"
                  width={width}
                >
                  {/* Header */}
                  {title ? (
                    <Box
                      alignItems="center"
                      flexDirection="row"
                      justifyContent="space-between"
                      mb="m"
                    >
                      <Text fontSize={18} fontWeight="700" variant="pixelHeader">
                        {title}
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
                  ) : undefined}

                  {/* Content */}
                  {children}
                </Card>
              </Animated.View>
            </Pressable>
          </Box>
        </Pressable>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
});
