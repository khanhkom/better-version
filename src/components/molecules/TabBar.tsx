/**
 * TabBar Component
 * Tab navigation for modals
 */

import React from 'react';

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

export type Tab = {
  readonly icon?: string;
  readonly id: string;
  readonly label: string;
};

type TabBarProps = {
  readonly activeTab: string;
  readonly onTabChange: (tabId: string) => void;
  readonly tabs: readonly Tab[];
};

export function TabBar({ activeTab, onTabChange, tabs }: TabBarProps) {
  return (
    <Box flexDirection="row" gap="s" mb="m">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          backgroundColor={
            activeTab === tab.id ? 'farmCardBgLight' : 'cardBgLight'
          }
          borderColor="farmBorder"
          borderRadius="m"
          borderWidth={activeTab === tab.id ? 2 : 1}
          flex={1}
          onPress={() => onTabChange(tab.id)}
          paddingHorizontal="s"
          paddingVertical="s"
        >
          <Text
            color={activeTab === tab.id ? 'textPrimary' : 'textSecondary'}
            fontSize={12}
            fontWeight={activeTab === tab.id ? '700' : '400'}
            textAlign="center"
          >
            {tab.icon} {tab.label}
          </Text>
        </Button>
      ))}
    </Box>
  );
}
