import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainTabNavigator } from '@/navigation/MainTabNavigator';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
import RestyleThemeProvider from '@/theme/ThemeProvider/RestyleThemeProvider';

import { Example, ProfileExample, Startup } from '@/screens';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme();

  return (
    <RestyleThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            initialRouteName={Paths.MainTabs}
            key={variant}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen component={MainTabNavigator} name={Paths.MainTabs} />
            <Stack.Screen component={ProfileExample} name={Paths.ProfileExample} />
            <Stack.Screen component={Startup} name={Paths.Startup} />
            <Stack.Screen component={Example} name={Paths.Example} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </RestyleThemeProvider>
  );
}

export default ApplicationNavigator;
