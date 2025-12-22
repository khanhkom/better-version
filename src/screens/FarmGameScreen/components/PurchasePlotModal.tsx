/**
 * PurchasePlotModal Component
 * Confirmation modal for purchasing new farm plots
 */

import { TouchableOpacity } from 'react-native';

import Box from '@/components/atoms/Box';
import { Emoji } from '@/components/atoms/Emoji';
import Text from '@/components/atoms/Text';
import { ModalWrapper } from '@/components/organisms/ModalWrapper';

type PurchasePlotModalProps = {
    readonly cost: number;
    readonly currentMoney: number;
    readonly onClose: () => void;
    readonly onConfirm: () => void;
    readonly plotNumber: number;
    readonly visible: boolean;
};

export function PurchasePlotModal({
    cost,
    currentMoney,
    onClose,
    onConfirm,
    plotNumber,
    visible,
}: PurchasePlotModalProps) {
    const canAfford = currentMoney >= cost;

    return (
        <ModalWrapper
            onClose={onClose}
            title="Mua Ô Đất"
            visible={visible}
            width={340}
        >
            <Box>
                {/* Plot info */}
                <Box alignItems="center" mb="l" paddingVertical="m">
                    <Emoji size={48} symbol="🏞️" />
                    <Text color="white" fontSize={16} fontWeight="700" mt="m" textAlign="center">
                        Ô Đất #{plotNumber}
                    </Text>
                </Box>

                {/* Cost display */}
                <Box
                    backgroundColor="farmBorderDark"
                    borderColor="farmBorder"
                    borderRadius="m"
                    borderWidth={2}
                    mb="l"
                    padding="m"
                >
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between" mb="s">
                        <Text color="farmCardBgLight" fontSize={13} fontWeight="600">
                            Giá:
                        </Text>
                        <Box alignItems="center" flexDirection="row" gap="xs">
                            <Emoji size={16} symbol="💰" />
                            <Text color="gold" fontSize={16} fontWeight="700">
                                {cost}
                            </Text>
                        </Box>
                    </Box>
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
                        <Text color="farmCardBgLight" fontSize={13} fontWeight="600">
                            Số dư:
                        </Text>
                        <Box alignItems="center" flexDirection="row" gap="xs">
                            <Emoji size={16} symbol="💰" />
                            <Text
                                color={canAfford ? 'success' : 'danger'}
                                fontSize={16}
                                fontWeight="700"
                            >
                                {currentMoney}
                            </Text>
                        </Box>
                    </Box>
                </Box>

                {/* Warning if cannot afford */}
                {!canAfford && (
                    <Box
                        backgroundColor="danger"
                        borderRadius="m"
                        mb="l"
                        opacity={0.9}
                        padding="m"
                    >
                        <Text color="white" fontSize={12} textAlign="center">
                            ⚠️ Không đủ tiền! Cần thêm {cost - currentMoney} xu
                        </Text>
                    </Box>
                )}

                {/* Action buttons */}
                <Box flexDirection="row" gap="m">
                    <Box flex={1}>
                        <TouchableOpacity onPress={onClose}>
                            <Box
                                alignItems="center"
                                backgroundColor="farmBorder"
                                borderColor="white"
                                borderRadius="m"
                                borderWidth={2}
                                justifyContent="center"
                                paddingVertical="m"
                            >
                                <Text color="white" fontSize={14} fontWeight="700">
                                    Hủy
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>

                    <Box flex={1}>
                        <TouchableOpacity disabled={!canAfford} onPress={onConfirm}>
                            <Box
                                alignItems="center"
                                backgroundColor={canAfford ? 'success' : 'farmBorderDark'}
                                borderColor="white"
                                borderRadius="m"
                                borderWidth={2}
                                justifyContent="center"
                                opacity={canAfford ? 1 : 0.5}
                                paddingVertical="m"
                            >
                                <Text color="white" fontSize={14} fontWeight="700">
                                    Mua
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </ModalWrapper>
    );
}
