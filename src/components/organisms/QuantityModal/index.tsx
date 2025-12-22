/**
 * QuantityModal Component
 * Modal for selecting quantity to buy/sell
 */

import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable } from 'react-native';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

type QuantityModalProps = {
  readonly itemName: string;
  readonly maxQuantity?: number;
  readonly onCancel: () => void;
  readonly onConfirm: (quantity: number) => void;
  readonly pricePerUnit: number;
  readonly visible: boolean;
};

export function QuantityModal({
  itemName,
  maxQuantity,
  onCancel,
  onConfirm,
  pricePerUnit,
  visible,
}: QuantityModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const handleIncrease = () => {
    setQuantity((previous) => {
      if (maxQuantity) {
        return Math.min(maxQuantity, previous + 1);
      }
      return previous + 1;
    });
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1); // Reset quantity
  };

  const handleCancel = () => {
    setQuantity(1); // Reset quantity
    onCancel();
  };

  const totalPrice = quantity * pricePerUnit;

  return (
    <Modal animationType="fade" onRequestClose={handleCancel} transparent visible={visible}>
      <Pressable
        onPress={handleCancel}
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Pressable onPress={(event) => { event.stopPropagation(); }}>
          <Box
            backgroundColor="farmCardBg"
            borderColor="farmBorderDark"
            borderRadius="xxl"
            borderWidth={8}
            padding="l"
            width={320}
          >
            {/* Title */}
            <Text fontSize={16} fontWeight="700" mb="m" textAlign="center">
              Bạn có muốn mua 1 vật phẩm
            </Text>
            <Text color="highlightYellow" fontSize={14} fontWeight="700" mb="l" textAlign="center">
              {itemName} với giá {pricePerUnit} xu?
            </Text>

            {/* Quantity Selector */}
            <Box alignItems="center" flexDirection="row" gap="m" justifyContent="center" mb="l">
              <Pressable onPress={handleDecrease}>
                <Box
                  alignItems="center"
                  backgroundColor="primary"
                  borderRadius="full"
                  height={40}
                  justifyContent="center"
                  width={40}
                >
                  <Minus color="white" size={24} />
                </Box>
              </Pressable>

              <Box
                alignItems="center"
                backgroundColor="farmCardBgLight"
                borderColor="farmBorder"
                borderRadius="m"
                borderWidth={2}
                height={48}
                justifyContent="center"
                width={80}
              >
                <Text fontSize={20} fontWeight="700">
                  {quantity}
                </Text>
              </Box>

              <Pressable onPress={handleIncrease}>
                <Box
                  alignItems="center"
                  backgroundColor="primary"
                  borderRadius="full"
                  height={40}
                  justifyContent="center"
                  width={40}
                >
                  <Plus color="white" size={24} />
                </Box>
              </Pressable>
            </Box>

            {/* Total Price */}
            <Box alignItems="center" mb="l">
              <Text color="textSecondary" fontSize={12} mb="xs">
                Tổng tiền:
              </Text>
              <Text color="highlightYellow" fontSize={18} fontWeight="700">
                {totalPrice} 💰
              </Text>
            </Box>

            {/* Action Buttons */}
            <Box flexDirection="row" gap="m">
              <Box flex={1}>
                <Button
                  borderRadius="s"
                  onPress={handleConfirm}
                  paddingHorizontal='l'
                  title="Mua lượng"
                  variant='outlined'
                />
              </Box>
              <Box flex={1}>
                <Button
                  borderRadius="s"
                  onPress={handleConfirm}
                  title="Mua xu"
                  variant='outlined'
                />
              </Box>
            </Box>

            {/* Cancel Button */}
            <Pressable onPress={handleCancel} style={{ marginTop: 12 }}>
              <Text color="primary" fontSize={14} fontWeight="600" textAlign="center">
                Hủy
              </Text>
            </Pressable>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
