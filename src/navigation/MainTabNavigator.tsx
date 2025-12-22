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

import { images } from '@/assets/images';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_SIZE_DEFAULT = 32;
const ICON_SIZE_FOCUSED = 36;

type TabBarIconProps = {
    readonly focused: boolean;
};

export function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={Paths.FarmGame}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: route.name === Paths.FarmGame ? '#689F38' : '#4A6FA5',
                    borderTopColor: route.name === Paths.FarmGame ? '#558B2F' : '#3A5A85',
                    borderTopWidth: 2,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 6,
                },
            })}
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

