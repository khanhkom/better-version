# System Architecture

This document outlines the technical architecture, design patterns, and system design of the BetterVersion React Native application.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Data Fetching Strategy](#data-fetching-strategy)
- [Navigation Structure](#navigation-structure)
- [API Integration Patterns](#api-integration-patterns)
- [Error Handling Strategy](#error-handling-strategy)
- [Testing Architecture](#testing-architecture)
- [Theme System Architecture](#theme-system-architecture)
- [Performance Optimizations](#performance-optimizations)

---

## Architecture Overview

BetterVersion follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (Screens, Components, Navigation)      │
├─────────────────────────────────────────┤
│           Business Logic Layer          │
│     (Hooks, Services, Validation)       │
├─────────────────────────────────────────┤
│            Data Layer                   │
│    (API Client, Storage, Cache)         │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │
│   (React Native, Third-party libs)      │
└─────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns**: Clear boundaries between UI, logic, and data
2. **Type Safety**: 100% TypeScript with strict mode
3. **Unidirectional Data Flow**: Props down, events up
4. **Composition over Inheritance**: Favor hooks and composition
5. **Single Responsibility**: Each module has one clear purpose
6. **Dependency Injection**: Services and utilities are injected, not imported directly

---

## Component Architecture

### Atomic Design Pattern

The application strictly follows **Atomic Design** methodology:

```
Atoms → Molecules → Organisms → Templates → Pages
```

#### 1. Atoms (Basic Building Blocks)

**Purpose**: Smallest, reusable UI elements

**Location**: `src/components/atoms/`

**Examples**:
- `Box.tsx` - Container component (restyle)
- `Text.tsx` - Text component (restyle)
- `Button.tsx` - Button with variants
- `Avatar.tsx` - Avatar with border and size
- `Badge.tsx` - Notification badge
- `ProgressBar.tsx` - Progress indicator

**Characteristics**:
- No business logic
- Highly reusable
- Theme-driven styling
- Props-based configuration

**Example Structure**:

```typescript
// atoms/Button.tsx
import { createRestyleComponent } from '@shopify/restyle';
import type { Theme } from '@/theme/restyle';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  onPress: () => void;
};

const Button: React.FC<ButtonProps> = ({ title, variant, onPress }) => {
  // Implementation using restyle
};
```

#### 2. Molecules (Composed Components)

**Purpose**: Combinations of atoms that form functional units

**Location**: `src/components/molecules/`

**Examples**:
- `StatCard.tsx` - Card with icon, value, and label
- `ItemCard.tsx` - Inventory item with image and badge
- `DefaultError.tsx` - Error message component

**Characteristics**:
- Composed of multiple atoms
- Single functional purpose
- Limited business logic
- Reusable across screens

**Example Structure**:

```typescript
// molecules/StatCard.tsx
import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';

type StatCardProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: 'gold' | 'blue' | 'orange';
};

const StatCard: React.FC<StatCardProps> = (props) => {
  // Compose atoms into functional unit
};
```

#### 3. Organisms (Complex Compositions)

**Purpose**: Complex UI sections with business logic

**Location**: `src/components/organisms/`

**Examples**:
- `ErrorBoundary/` - Global error boundary

**Characteristics**:
- Contains business logic
- May connect to state/context
- Composed of molecules and atoms
- Screen-specific or reusable

#### 4. Templates (Page Layouts)

**Purpose**: Page-level layouts that define structure

**Location**: `src/components/templates/`

**Examples**:
- `SafeScreen/` - Screen with safe area and error boundary

**Characteristics**:
- Define page structure
- No specific content
- Provide consistent layouts
- Handle common screen concerns

#### 5. Pages (Screens)

**Purpose**: Actual application screens with real content

**Location**: `src/screens/`

**Examples**:
- `Startup/` - Initial loading screen
- `Example/` - Example screen
- `ProfileExample.tsx` - Profile demo screen

**Characteristics**:
- Use templates for layout
- Connect to hooks for data
- Handle screen-specific logic
- Navigation integration

### Component Communication

```
┌──────────────────────────────────────┐
│            Parent Component          │
│                                      │
│  Props ↓              Events ↑      │
│                                      │
├──────────────────────────────────────┤
│           Child Component            │
│                                      │
│  - Receives props                    │
│  - Emits events via callbacks        │
│  - No direct parent manipulation     │
└──────────────────────────────────────┘
```

---

## State Management

### State Architecture

The application uses a **multi-tier state management approach**:

```
┌─────────────────────────────────────┐
│         Component State             │
│      (useState, useReducer)         │
├─────────────────────────────────────┤
│       Shared UI State               │
│         (Zustand)                   │
├─────────────────────────────────────┤
│       Server State                  │
│    (TanStack Query)                 │
├─────────────────────────────────────┤
│     Persistent Storage              │
│         (MMKV)                      │
└─────────────────────────────────────┘
```

### 1. Component State (React Hooks)

**Use Case**: Local component state that doesn't need sharing

```typescript
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
```

**When to Use**:
- UI toggles (modals, dropdowns)
- Form inputs
- Temporary state
- Animation state

### 2. Shared UI State (Zustand)

**Use Case**: Global UI state shared across components

```typescript
import { create } from 'zustand';

type ThemeStore = {
  isDark: boolean;
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeStore>((set) => ({
  isDark: true,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
```

**When to Use**:
- Theme preferences
- User settings
- Global UI state
- App-wide flags

**Integration with MMKV**:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const useStore = create(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      })),
    }
  )
);
```

### 3. Server State (TanStack Query)

**Use Case**: Data from backend APIs with caching

```typescript
import { useQuery } from '@tanstack/react-query';

const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**When to Use**:
- API data
- Server-synchronized state
- Cached data
- Background refetching

**Query Client Configuration**:

```typescript
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

### 4. Persistent Storage (MMKV)

**Use Case**: Fast, synchronous local storage

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Store
storage.set('user.name', 'John');
storage.set('user.age', 30);

// Retrieve
const name = storage.getString('user.name');
const age = storage.getNumber('user.age');

// Delete
storage.delete('user.name');
```

**When to Use**:
- User preferences
- Auth tokens
- Offline data
- Cache

---

## Data Fetching Strategy

### Domain-Driven Hook Pattern

The application follows a **3-layer pattern** for data fetching:

```
Schema → Service → Hook → Component
```

#### Layer 1: Schema (Validation)

**Purpose**: Define and validate data structures

**Location**: `src/hooks/domain/{entity}/schema.ts`

```typescript
import { z } from 'zod';

// Define schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
});

// Infer TypeScript type
export type User = z.infer<typeof userSchema>;
```

**Benefits**:
- Runtime validation
- Type safety
- Documentation
- Error messages

#### Layer 2: Service (API Calls)

**Purpose**: HTTP requests with validation

**Location**: `src/hooks/domain/{entity}/{entity}Service.ts`

```typescript
import { instance } from '@/services/instance';
import { userSchema, type User } from './schema';

export const UserServices = {
  fetchOne: async (id: number): Promise<User> => {
    const response = await instance.get(`users/${id}`).json();
    return userSchema.parse(response); // Validates response
  },

  fetchAll: async (): Promise<User[]> => {
    const response = await instance.get('users').json();
    return z.array(userSchema).parse(response);
  },

  create: async (data: Omit<User, 'id'>): Promise<User> => {
    const response = await instance.post('users', { json: data }).json();
    return userSchema.parse(response);
  },
};
```

**Benefits**:
- Centralized API logic
- Consistent error handling
- Reusable across hooks
- Testable in isolation

#### Layer 3: Hook (React Query Integration)

**Purpose**: React hooks with caching and state management

**Location**: `src/hooks/domain/{entity}/use{Entity}.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserServices } from './userService';
import type { User } from './schema';

const UserQueryKey = {
  all: 'users',
  fetchOne: 'user.fetchOne',
  fetchAll: 'user.fetchAll',
} as const;

export const useUser = () => {
  const queryClient = useQueryClient();

  const fetchOne = (userId: number) =>
    useQuery({
      queryKey: [UserQueryKey.fetchOne, userId],
      queryFn: () => UserServices.fetchOne(userId),
      enabled: userId > 0,
    });

  const fetchAll = () =>
    useQuery({
      queryKey: [UserQueryKey.fetchAll],
      queryFn: UserServices.fetchAll,
    });

  const create = useMutation({
    mutationFn: UserServices.create,
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.fetchAll] });
    },
  });

  return { fetchAll, fetchOne, create };
};
```

**Usage in Component**:

```typescript
import { useUser } from '@/hooks/domain/user';

const ProfileScreen = ({ userId }: Props) => {
  const { fetchOne } = useUser();
  const { data, isLoading, error } = fetchOne(userId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return <UserProfile user={data} />;
};
```

### HTTP Client Configuration

**Location**: `src/services/instance.ts`

```typescript
import ky from 'ky';

export const instance = ky.create({
  prefixUrl: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  retry: {
    limit: 2,
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
});
```

---

## Navigation Structure

### React Navigation Setup

**Type-Safe Navigation** with TypeScript:

```
paths.ts → types.ts → Application.tsx → Screens
```

#### 1. Define Routes (paths.ts)

```typescript
export const enum Paths {
  Startup = 'startup',
  ProfileExample = 'profileExample',
  Example = 'example',
}
```

#### 2. Define Param Types (types.ts)

```typescript
import type { Paths } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  [Paths.Startup]: undefined;
  [Paths.ProfileExample]: undefined;
  [Paths.Example]: { userId?: number };
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
```

#### 3. Setup Navigator (Application.tsx)

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  return (
    <RestyleThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={Paths.ProfileExample}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen component={ProfileExample} name={Paths.ProfileExample} />
            <Stack.Screen component={Example} name={Paths.Example} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </RestyleThemeProvider>
  );
}
```

#### 4. Use in Screens

```typescript
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';

type ExampleScreenProps = RootScreenProps<Paths.Example>;

const ExampleScreen: React.FC<ExampleScreenProps> = ({ navigation, route }) => {
  const userId = route.params?.userId;

  const handleNavigate = () => {
    navigation.navigate(Paths.ProfileExample);
  };

  return <View>{/* Screen content */}</View>;
};
```

### Navigation Patterns

**Navigate to Screen**:
```typescript
navigation.navigate(Paths.ProfileExample);
```

**Navigate with Params**:
```typescript
navigation.navigate(Paths.Example, { userId: 123 });
```

**Go Back**:
```typescript
navigation.goBack();
```

**Reset Navigation**:
```typescript
navigation.reset({
  index: 0,
  routes: [{ name: Paths.Startup }],
});
```

---

## API Integration Patterns

### Request/Response Flow

```
Component → Hook → Service → HTTP Client → API
                                              ↓
Component ← Hook ← Service ← Response ← API Response
```

### Error Handling in Services

```typescript
export const UserServices = {
  fetchOne: async (id: number): Promise<User> => {
    try {
      const response = await instance.get(`users/${id}`).json();
      return userSchema.parse(response);
    } catch (error) {
      if (error instanceof HTTPError) {
        const statusCode = error.response.status;
        if (statusCode === 404) {
          throw new Error('User not found');
        }
        if (statusCode === 401) {
          throw new Error('Unauthorized');
        }
      }
      throw error;
    }
  },
};
```

### Query Invalidation

```typescript
const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['user', userId] });

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: ['user'] });

// Refetch immediately
queryClient.refetchQueries({ queryKey: ['user', userId] });
```

---

## Error Handling Strategy

### Multi-Level Error Handling

```
ErrorBoundary → SafeScreen → Component → Service
```

#### 1. Global Error Boundary

**Location**: `src/components/organisms/ErrorBoundary/`

```typescript
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={DefaultError}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Log to error tracking service
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

#### 2. Screen-Level Error Handling

**Location**: `src/components/templates/SafeScreen/`

```typescript
function SafeScreen({ children, isLoading, isError }: Props) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;

  return (
    <SafeAreaView>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </SafeAreaView>
  );
}
```

#### 3. Query Error Handling

```typescript
const { data, isError, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => UserServices.fetchOne(userId),
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

---

## Testing Architecture

### Test Pyramid

```
       ┌──────────┐
       │   E2E    │  (Few)
       ├──────────┤
       │Integration│ (Some)
       ├──────────┤
       │   Unit   │  (Many)
       └──────────┘
```

### Testing Stack

- **Jest**: Test runner
- **@testing-library/react-native**: Component testing
- **react-test-renderer**: Rendering components

### TestAppWrapper

**Location**: `src/tests/TestAppWrapper.tsx`

Provides all necessary providers for isolated component testing:

```typescript
export function TestAppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

### Testing Patterns

**Component Test**:
```typescript
import { render, screen } from '@testing-library/react-native';
import { TestAppWrapper } from '@/tests/TestAppWrapper';
import Button from './Button';

describe('Button', () => {
  it('renders title correctly', () => {
    render(<Button title="Click me" onPress={() => {}} />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByText('Click me')).toBeTruthy();
  });
});
```

**Service Test**:
```typescript
import { UserServices } from './userService';

describe('UserServices', () => {
  it('fetches user by id', async () => {
    const user = await UserServices.fetchOne(1);
    expect(user).toHaveProperty('id', 1);
  });
});
```

---

## Theme System Architecture

### Dual Theme System

The app maintains **two theme systems** during migration:

1. **Legacy Theme** (`src/theme/_config.ts`) - Older implementation
2. **Restyle Theme** (`src/theme/restyle.ts`) - **NEW, actively used**

### Restyle Theme Structure

```typescript
const theme = createTheme({
  colors: { /* color palette */ },
  spacing: { /* spacing scale */ },
  borderRadii: { /* border radius scale */ },
  textVariants: { /* text styles */ },
  cardVariants: { /* card styles */ },
  buttonVariants: { /* button styles */ },
});

export type Theme = typeof theme;
```

### Theme Provider Hierarchy

```
App
 └─ RestyleThemeProvider (NEW)
     └─ SafeAreaProvider
         └─ NavigationContainer
             └─ ThemeProvider (Legacy)
                 └─ Screens
```

---

## Performance Optimizations

### 1. List Performance

Use `@shopify/flash-list` instead of FlatList:

```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  estimatedItemSize={100}
  renderItem={({ item }) => <ItemCard item={item} />}
/>
```

### 2. Storage Performance

Use MMKV for fast, synchronous storage:

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
storage.set('key', 'value'); // ~30x faster than AsyncStorage
```

### 3. Animation Performance

Use Reanimated for smooth 60fps animations:

```typescript
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
```

### 4. Query Optimization

- Use `staleTime` to reduce unnecessary refetches
- Implement pagination for large datasets
- Use `enabled` flag for conditional queries
- Prefetch data when navigation is likely

---

## Summary

The BetterVersion architecture emphasizes:

✅ **Type Safety**: TypeScript everywhere
✅ **Separation of Concerns**: Clear layer boundaries
✅ **Testability**: Isolated, mockable components
✅ **Performance**: Optimized libraries and patterns
✅ **Maintainability**: Consistent patterns and structure
✅ **Scalability**: Domain-driven organization

This architecture provides a solid foundation for building complex, maintainable React Native applications.
