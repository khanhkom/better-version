/**
 * StatisticsScreen
 * Habit statistics and progress tracking
 */

import { FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

import { useGameStore } from '@/stores/gameStore';

import { DAYS_OF_WEEK, HabitRow } from '../HabitsScreen/components';

export function StatisticsScreen() {
    const habits = useGameStore((state) => state.habits);

    return (
        <LinearGradient
            colors={['#4DD0E1', '#0097A7']}
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#00838F"
                barStyle="light-content"
            />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <Box padding="m">
                    <Text color="white" fontSize={24} fontWeight="700" mb="m">
                        📊 Thống Kê
                    </Text>
                </Box>

                {/* Content */}
                <Box flex={1} padding="m">
                    {/* Stats Header */}
                    <Box
                        backgroundColor="farmBorderDark"
                        borderRadius='m'
                        flexDirection="row"
                        justifyContent="space-between"
                        marginBottom='m'
                        padding="m"
                    >
                        <Text color="white" fontSize={12} fontWeight="700">
                            THÓI QUEN
                        </Text>
                        <Box alignItems='center' flexDirection="row" gap="xxl">
                            <Box flexDirection="row" gap="xs">
                                {DAYS_OF_WEEK.map((day) => (
                                    <Text color="white" fontSize={10} key={day}>
                                        {day}
                                    </Text>
                                ))}
                            </Box>
                            <Text color="white" fontSize={12} fontWeight="700">
                                CHUỖI
                            </Text>
                        </Box>
                    </Box>

                    {/* Habit Rows */}
                    {habits.length === 0 ? (
                        <Box alignItems="center" padding="l">
                            <Text color="farmCardBgLight" fontSize={14} textAlign="center">
                                📋 Chưa có thói quen nào
                            </Text>
                        </Box>
                    ) : (
                        <FlatList
                            data={habits}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <HabitRow habit={item} />}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </Box>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});
