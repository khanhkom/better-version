/**
 * MainTabNavigator
 * Bottom tab navigator for main app screens
 */

import type { MainTabParamList } from '@/navigation/types';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import { FarmGameScreen } from '@/screens/FarmGameScreen';
import { HabitsScreen } from '@/screens/HabitsScreen';
import { StatisticsScreen } from '@/screens/StatisticsScreen';

import { images } from '@/assets/images';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_SIZE_DEFAULT = 32;
const ICON_SIZE_FOCUSED = 36;

type TabBarIconProps = {
    readonly focused: boolean;
};

// Tab color configuration - easy to add new tabs
const TAB_COLORS = {
    [Paths.FarmGame]: {
        background: '#388E3C',
        border: '#2E7D32',
    },
    [Paths.Habits]: {
        background: '#7B1FA2',
        border: '#6A1B9A',
    },
    [Paths.Statistics]: {
        background: '#0097A7',
        border: '#00838F',
    },
} as const;

export function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={Paths.FarmGame}
            screenOptions={({ route }) => {
                const colors = TAB_COLORS[route.name as keyof typeof TAB_COLORS];

                return {
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.border,
                        borderTopWidth: 2,
                        height: 70,
                        paddingBottom: 10,
                        paddingTop: 6,
                    },
                };
            }}
        >
            <Tab.Screen
                component={HabitsScreen}
                name={Paths.Habits}
                options={{
                    tabBarIcon: HabitsIcon,
                }}
            />
            <Tab.Screen
                component={FarmGameScreen}
                name={Paths.FarmGame}
                options={{
                    tabBarIcon: FarmIcon,
                }}
            />
            <Tab.Screen
                component={StatisticsScreen}
                name={Paths.Statistics}
                options={{
                    tabBarIcon: StatisticsIcon,
                }}
            />
        </Tab.Navigator>
    );
}

function FarmIcon({ focused }: TabBarIconProps) {
    const size = focused ? ICON_SIZE_FOCUSED : ICON_SIZE_DEFAULT;
    return (
        <View style={{
            alignItems: 'center',
            marginTop: 12
        }}>
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderRadius: 12,
                    height: 56,
                    justifyContent: 'center',
                    paddingBlock: 8,
                    width: 56
                }}
            >
                <Image resizeMode="contain" source={images.home.icFarm} style={{ height: size, width: size }} />
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginTop: 4 }}>
                    Vườn cây
                </Text>
            </View>

        </View>
    );
}

function HabitsIcon({ focused }: TabBarIconProps) {
    const size = focused ? ICON_SIZE_FOCUSED : ICON_SIZE_DEFAULT;
    return (
        <View style={{
            alignItems: 'center',
            marginTop: 12


        }}>
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderRadius: 12,
                    height: 56,
                    justifyContent: 'center',
                    paddingBlock: 8,
                    width: 56
                }}
            >
                <Image resizeMode="contain" source={images.home.icMission} style={{ height: size, width: size }} />
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginTop: 4 }}>
                    Nhiệm vụ
                </Text>
            </View>

        </View>
    );
}

function StatisticsIcon({ focused }: TabBarIconProps) {
    const size = focused ? ICON_SIZE_FOCUSED : ICON_SIZE_DEFAULT;
    return (
        <View style={{
            alignItems: 'center',
            marginTop: 12
        }}>
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: focused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderRadius: 12,
                    height: 56,
                    justifyContent: 'center',
                    paddingBlock: 8,
                    width: 56
                }}
            >
                <Image resizeMode="contain" source={images.home.icStatistic} style={{ height: size, width: size }} />
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginTop: 4 }}>
                    Thống kê
                </Text>
            </View>
        </View>
    );
}

