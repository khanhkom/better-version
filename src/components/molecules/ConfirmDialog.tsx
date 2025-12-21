/**
 * ConfirmDialog Component
 * Confirmation dialog for buy/sell transactions
 */

import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';

type ConfirmDialogProps = {
  readonly confirmText?: string;
  readonly message: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly visible: boolean;
};

export function ConfirmDialog({
  confirmText = 'Xác nhận',
  message,
  onCancel,
  onConfirm,
  title,
  visible,
}: ConfirmDialogProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable onPress={onCancel} style={styles.backdrop}>
        <Box alignItems="center" flex={1} justifyContent="center">
          <Pressable onPress={(e) => { e.stopPropagation(); }}>
            <Card
              backgroundColor="farmCardBg"
              borderColor="farmBorderDark"
              borderRadius="xl"
              borderWidth={6}
              padding="l"
              width={300}
            >
              {/* Title */}
              <Text
                fontSize={16}
                fontWeight="700"
                mb="m"
                textAlign="center"
                variant="pixelHeader"
              >
                {title}
              </Text>

              {/* Message */}
              <Text
                color="textSecondary"
                fontSize={13}
                mb="l"
                textAlign="center"
              >
                {message}
              </Text>

              {/* Action Buttons */}
              <Box flexDirection="row" gap="m">
                <Button
                  backgroundColor="cardBg"
                  borderColor="farmBorder"
                  borderRadius="m"
                  borderWidth={2}
                  flex={1}
                  onPress={onCancel}
                  paddingVertical="m"
                >
                  <Text fontSize={12} fontWeight="600" textAlign="center">
                    Hủy
                  </Text>
                </Button>
                <Button
                  backgroundColor="success"
                  borderColor="farmBorder"
                  borderRadius="m"
                  borderWidth={2}
                  flex={1}
                  onPress={() => {
                    onConfirm();
                    onCancel();
                  }}
                  paddingVertical="m"
                >
                  <Text fontSize={12} fontWeight="600" textAlign="center">
                    {confirmText}
                  </Text>
                </Button>
              </Box>
            </Card>
          </Pressable>
        </Box>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
});
