/**
 * MainTabNavigator
 * Bottom tab navigator for main app screens
 */

import type { MainTabParamList } from '@/navigation/types';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClipboardList, Sprout } from 'lucide-react-native';

import { Paths } from '@/navigation/paths';

import { FarmGameScreen } from '@/screens/FarmGameScreen';
import { HabitsScreen } from '@/screens/HabitsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabBarIconProps = {
    readonly color: string;
};

export function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={Paths.FarmGame}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                    backgroundColor: '#5d4037',
                    borderTopColor: '#3e2723',
                    borderTopWidth: 2,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tab.Screen
                component={HabitsScreen}
                name={Paths.Habits}
                options={{
                    tabBarIcon: HabitsIcon,
                    tabBarLabel: 'Nhiệm vụ',
                }}
            />
            <Tab.Screen
                component={FarmGameScreen}
                name={Paths.FarmGame}
                options={{
                    tabBarIcon: FarmIcon,
                    tabBarLabel: 'Vườn cây',
                }}
            />
        </Tab.Navigator>
    );
}

function FarmIcon({ color }: TabBarIconProps) {
    return <Sprout color={color} size={24} />;
}

function HabitsIcon({ color }: TabBarIconProps) {
    return <ClipboardList color={color} size={24} />;
}

