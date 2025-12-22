/**
 * TabNavigation Component
 * Tab navigation for HabitsScreen with 2 tabs: Tasks, Statistics
 */

import Box from '@/components/atoms/Box';
import Button from '@/components/atoms/Button';

export type TabType = 'statistics' | 'tasks';

type TabNavigationProps = {
    readonly activeTab: TabType;
    readonly onTabChange: (tab: TabType) => void;
};

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <Box
            flexDirection="row"
            gap="s"
            padding="m"
        >
            <Box flex={1}>
                <Button
                    backgroundColor={activeTab === 'tasks' ? 'highlightYellow' : 'farmCardBg'}
                    borderColor={activeTab === 'tasks' ? 'white' : 'farmBorder'}
                    borderRadius="s"
                    borderWidth={2}
                    onPress={() => { onTabChange('tasks'); }}
                    paddingVertical="s"
                    textColor={activeTab === 'tasks' ? 'farmBorderDark' : 'farmBorderDark'}
                    title="Nhiệm Vụ"
                />
            </Box>
            <Box flex={1}>
                <Button
                    backgroundColor={activeTab === 'statistics' ? 'highlightYellow' : 'farmCardBg'}
                    borderColor={activeTab === 'statistics' ? 'white' : 'farmBorder'}
                    borderRadius="s"
                    borderWidth={2}
                    onPress={() => { onTabChange('statistics'); }}
                    paddingVertical="s"
                    textColor={activeTab === 'statistics' ? 'farmBorderDark' : 'farmBorderDark'}
                    title="Thống Kê"
                />
            </Box>
        </Box>
    );
}

