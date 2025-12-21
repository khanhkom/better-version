# 11 - Navigation Flow

**Date:** 2025-12-22
**Priority:** 🟡 P1
**Status:** Draft

---

## Updated Navigation Structure

```typescript
// src/navigation/paths.ts
export const Paths = {
  Startup: '/startup',
  FarmGame: '/farm',        // NEW - Main game screen
  ProfileExample: '/profile',
} as const;
```

```typescript
// src/navigation/Application.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FarmGameScreen } from '@/screens/FarmGameScreen';
import { ProfileExample } from '@/screens/ProfileExample';
import { Paths } from './paths';

const Stack = createNativeStackNavigator();

function ApplicationNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FarmGame"
    >
      <Stack.Screen name="FarmGame" component={FarmGameScreen} />
      <Stack.Screen name="ProfileExample" component={ProfileExample} />
    </Stack.Navigator>
  );
}

export default ApplicationNavigator;
```

---

## Deep Linking (Future)

```typescript
// src/navigation/linking.ts
export const linking = {
  prefixes: ['pixelfarm://', 'https://pixelfarm.app'],
  config: {
    screens: {
      FarmGame: 'farm',
      ProfileExample: 'profile',
    },
  },
};

// Usage in App.tsx
<NavigationContainer linking={linking}>
  <ApplicationNavigator />
</NavigationContainer>
```

---

## Splash Screen (Future)

```typescript
// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Emoji } from '@/components/atoms/Emoji';

export const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Load game state, check for updates, etc.
    setTimeout(() => {
      navigation.replace('FarmGame');
    }, 2000);
  }, []);

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="farmBoard">
      <Emoji symbol="🚜" size={80} />
      <Text variant="pixelHeader" fontSize={32} mt="l">
        Pixel Farm
      </Text>
      <Text variant="body" mt="s">
        Loading...
      </Text>
    </Box>
  );
};
```

---

## Next Steps

1. ⬜ Update navigation paths
2. ⬜ Set FarmGame as initial route
3. ⬜ Test navigation between screens
4. ⬜ (Optional) Add SplashScreen
5. ⬜ (Optional) Configure deep linking
