# 05 - Modal System

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Status:** Draft

---

## ModalWrapper Component

```typescript
// src/components/organisms/ModalWrapper.tsx
import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { Box } from '@/components/atoms/Box';
import { IconButton } from '@/components/atoms/IconButton';

type ModalWrapperProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const ModalWrapper = ({ visible, onClose, title, children }: ModalWrapperProps) => (
  <Modal transparent visible={visible} animationType="none">
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backdrop}>
      <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />

      <Pressable style={styles.backdropPress} onPress={onClose} />

      <Animated.View entering={SlideInUp} exiting={SlideOutDown} style={styles.modal}>
        <Box
          backgroundColor="farmCardBg"
          borderRadius="xxl"
          borderWidth={8}
          borderColor="farmBorderDark"
          p="l"
          maxHeight="90%"
        >
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb="m">
            <Text variant="pixelHeader">{title}</Text>
            <IconButton icon="❌" onPress={onClose} />
          </Box>

          {children}
        </Box>
      </Animated.View>
    </Animated.View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: '90%',
    maxWidth: 600,
  },
});
```

---

## Usage Example

```typescript
<ModalWrapper
  visible={activeModal === 'HABITS'}
  onClose={closeModal}
  title="📋 Nhiệm Vụ"
>
  {/* Modal content */}
</ModalWrapper>
```

---

## Dependencies

- Install: `yarn add @react-native-community/blur react-native-reanimated`
- Config Reanimated plugin in `babel.config.js`
