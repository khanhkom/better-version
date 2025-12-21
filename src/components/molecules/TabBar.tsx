/**
 * TabBar Component
 * Tab navigation for modals
 */

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';

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
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const title = `${tab.icon ?? ''} ${tab.label}`.trim();

        return (
          <Box flex={1} key={tab.id}>
            <Button
              backgroundColor={isActive ? 'farmCardBgLight' : 'cardBgLight'}
              borderColor="farmBorder"
              borderRadius="m"
              borderWidth={isActive ? 2 : 1}
              fontSize={12}
              onPress={() => { onTabChange(tab.id); }}
              paddingHorizontal="s"
              paddingVertical="s"
              textColor={isActive ? 'textPrimary' : 'textSecondary'}
              title={title}
            />
          </Box>
        );
      })}
    </Box>
  );
}
