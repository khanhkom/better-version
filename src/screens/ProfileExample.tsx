import React from 'react';
import { ScrollView } from 'react-native';

import {
  Avatar,
  Badge,
  Box,
  Button,
  ProgressBar,
  Text,
} from '@/components/atoms';
import { ItemCard, StatCard } from '@/components/molecules';

function ProfileExample() {
  return (
    <ScrollView style={{ backgroundColor: '#0A0B0F', flex: 1 }}>
      <Box backgroundColor="mainBackground" flex={1} padding="l">
        {/* Header */}
        <Box flexDirection="row" justifyContent="space-between" marginBottom="xl">
          <Box
            alignItems="center"
            backgroundColor="cardBgLight"
            borderRadius="s"
            height={40}
            justifyContent="center"
            width={40}
          >
            <Text fontSize={20}>←</Text>
          </Box>
          <Text variant="header">CHIẾN BINH</Text>
          <Box
            alignItems="center"
            backgroundColor="cardBgLight"
            borderRadius="s"
            height={40}
            justifyContent="center"
            width={40}
          >
            <Text fontSize={20}>⚙️</Text>
          </Box>
        </Box>

        {/* Avatar & Level */}
        <Box alignItems="center" marginBottom="xl">
          <Box marginBottom="m" position="relative">
            <Avatar
              borderColor="borderPrimary"
              size="large"
              source={{ uri: 'https://via.placeholder.com/100' }}
            />
            <Box
              backgroundColor="secondary"
              borderRadius="s"
              paddingHorizontal="s"
              paddingVertical="xs"
              position="absolute"
              right={-10}
              top={-10}
            >
              <Text color="black" fontWeight="700" variant="caption">
                LVL 12
              </Text>
            </Box>
          </Box>

          <Text marginBottom="xs" variant="header">
            Chiến binh Hảo
          </Text>
          <Box alignItems="center" flexDirection="row">
            <Text fontSize={16}>✓</Text>
            <Text color="primary" marginLeft="xs" variant="body">
              HẠNG: KẺ CHÍNH PHỤC
            </Text>
          </Box>
        </Box>

        {/* Stats */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="xl"
        >
          <StatCard
            borderColor="secondary"
            icon={<Text fontSize={24}>💰</Text>}
            label="VÀNG"
            value="450"
            variant="gold"
          />
          <StatCard
            borderColor="primary"
            icon={<Text fontSize={24}>💎</Text>}
            label="ĐÁ QUÝ"
            value="12"
            variant="blue"
          />
          <StatCard
            borderColor="warning"
            icon={<Text fontSize={24}>🔥</Text>}
            label="CHUỖI NGÀY"
            value="5"
            variant="orange"
          />
        </Box>

        {/* Progress Bars */}
        <Box marginBottom="xl">
          <ProgressBar
            caption="Thiếu 750 XP đi lên cấp"
            current={1250}
            icon={<Text fontSize={16}>⚡</Text>}
            label="KINH NGHIỆM"
            max={2000}
            variant="yellow"
          />
        </Box>

        <Box marginBottom="xl">
          <ProgressBar
            current={85}
            icon={<Text fontSize={16}>❤️</Text>}
            label="SỨC KHỎE"
            max={100}
            variant="pink"
          />
        </Box>

        {/* Inventory */}
        <Box
          backgroundColor="cardBgLight"
          borderRadius="l"
          marginBottom="xl"
          padding="l"
        >
          <Box
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            marginBottom="l"
          >
            <Box alignItems="center" flexDirection="row">
              <Text fontSize={20} marginRight="s">
                📦
              </Text>
              <Text color="success" variant="header">
                KHO ĐỒ
              </Text>
            </Box>
            <Box alignItems="center" flexDirection="row">
              <Text color="textSecondary" marginRight="xs" variant="body">
                Tất cả
              </Text>
              <Text color="primary" variant="body">
                Mở rộng →
              </Text>
            </Box>
          </Box>

          <Box flexDirection="row" justifyContent="space-between">
            <ItemCard
              image={{ uri: 'https://via.placeholder.com/80' }}
              isEquipped
              name="Kiếm sắt"
              status="Đã trang bị"
            />
            <ItemCard
              badgeCount={3}
              borderColor="danger"
              image={{ uri: 'https://via.placeholder.com/80' }}
              name="Bình máu"
              status="HỒI PHỤC"
            />
          </Box>

          <Box flexDirection="row" justifyContent="space-between" marginTop="l">
            <ItemCard
              image={{ uri: 'https://via.placeholder.com/80' }}
              name="Khiên gỗ"
              status="PHÒNG THỦ +2"
            />
            <ItemCard
              image={{ uri: 'https://via.placeholder.com/80' }}
              name="Trứng bi ẩn"
              status=""
            />
          </Box>
        </Box>

        {/* Action Button */}
        <Button
          onPress={() => { console.log('Claim reward'); }}
          title="NHẬN THƯỞNG"
          variant="primary"
        />
      </Box>
    </ScrollView>
  );
}

export default ProfileExample;
