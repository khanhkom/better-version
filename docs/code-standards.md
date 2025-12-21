# Code Standards

This document defines the coding standards and best practices for the BetterVersion React Native project.

## Table of Contents

- [TypeScript Conventions](#typescript-conventions)
- [ESLint Configuration](#eslint-configuration)
- [Prettier Configuration](#prettier-configuration)
- [Naming Conventions](#naming-conventions)
- [Import Organization](#import-organization)
- [File Structure Patterns](#file-structure-patterns)
- [Component Patterns](#component-patterns)
- [Testing Standards](#testing-standards)
- [Code Review Checklist](#code-review-checklist)

---

## TypeScript Conventions

### Configuration

The project uses strict TypeScript configuration extending `@react-native/typescript-config`:

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "noUnusedLocals": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Best Practices

#### 1. Use `type` instead of `interface`

```typescript
// ✅ Correct
type UserProps = {
  id: number;
  name: string;
};

// ❌ Avoid
interface UserProps {
  id: number;
  name: string;
}
```

This is enforced by ESLint rule: `@typescript-eslint/consistent-type-definitions: ['error', 'type']`

#### 2. Prefer Named Exports

```typescript
// ✅ Correct
export type Theme = typeof theme;
export { default as Box } from './Box';

// ❌ Avoid default exports without named exports
export default SomeComponent;
```

#### 3. Properly Type Component Props

```typescript
// ✅ Correct
type AvatarProps = {
  source: ImageSourcePropType;
  size?: 'small' | 'medium' | 'large';
  borderColor?: keyof Theme['colors'];
};

const Avatar: React.FC<AvatarProps> = ({ source, size = 'medium', borderColor }) => {
  // Implementation
};
```

#### 4. Use Type Inference When Obvious

```typescript
// ✅ Correct
const count = 0; // number inferred
const items = ['a', 'b']; // string[] inferred

// ❌ Unnecessary
const count: number = 0;
const items: string[] = ['a', 'b'];
```

#### 5. Use `keyof` for Type-Safe Object Keys

```typescript
// ✅ Correct
type ColorKey = keyof Theme['colors'];
const textColor: ColorKey = 'textPrimary';
```

---

## ESLint Configuration

### Enabled Configurations

- `eslint:recommended`
- `@typescript-eslint/strict-type-checked`
- `@typescript-eslint/stylistic-type-checked`
- `unicorn/all`
- `perfectionist` (alphabetical sorting)
- `plugin:react/all`
- `plugin:react/jsx-runtime`
- `plugin:testing-library/react`

### Key Rules

#### Console Statements

```javascript
'no-console': ['error', { allow: ['warn', 'error'] }]
```

```typescript
// ✅ Allowed
console.warn('Warning message');
console.error('Error message');

// ❌ Not allowed
console.log('Debug info'); // Use a proper debugger instead
```

#### Magic Numbers

```javascript
'no-magic-numbers': ['error', {
  ignore: [-1, 0, 1, 2, 3, 4, 5, 6],
  ignoreArrayIndexes: true
}]
```

```typescript
// ✅ Correct
const DEFAULT_TIMEOUT = 5000;
setTimeout(callback, DEFAULT_TIMEOUT);

// ❌ Avoid
setTimeout(callback, 5000);
```

#### Type Definitions

```typescript
// ✅ Use 'type'
type ButtonVariant = 'primary' | 'secondary' | 'outlined';

// ❌ Don't use 'interface' for type aliases
interface ButtonVariant = 'primary' | 'secondary'; // This won't even compile
```

#### React Rules

- Max JSX depth: 10 levels
- Props sorting: alphabetically
- No array index as key (unless items are static)

---

## Prettier Configuration

Minimal configuration for consistent formatting:

```javascript
export default {
  singleQuote: true,
};
```

All other settings use Prettier defaults:
- Print width: 80
- Tab width: 2
- Semicolons: true
- Trailing commas: es5

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `StatCard.tsx` |
| Utilities | camelCase | `formatDate.ts`, `apiClient.ts` |
| Hooks | camelCase with 'use' | `useUser.ts`, `useTheme.ts` |
| Types | PascalCase | `types.ts`, `schema.ts` |
| Tests | Same as source + `.test` | `Button.test.tsx` |
| Constants | camelCase or UPPER_CASE | `constants.ts`, `paths.ts` |

### Components

```typescript
// ✅ Correct - PascalCase
const StatCard: React.FC<StatCardProps> = () => {};
const ProfileExample = () => {};

// ❌ Avoid
const statCard = () => {};
const profile_example = () => {};
```

### Types & Interfaces

```typescript
// ✅ Correct - PascalCase with descriptive suffix
type ButtonProps = { /* ... */ };
type AvatarSize = 'small' | 'medium' | 'large';
type UserQueryKey = 'fetchOne' | 'fetchAll';

// ❌ Avoid generic names
type Props = { /* ... */ };
type Size = string;
```

### Enums

```typescript
// ✅ Correct
export const enum Paths {
  Example = 'example',
  ProfileExample = 'profileExample',
  Startup = 'startup',
}

// Usage
const path = Paths.ProfileExample;
```

### Hooks

```typescript
// ✅ Correct - camelCase starting with 'use'
const useUser = () => {};
const useFetchOneQuery = () => {};
const useI18n = () => {};

// ❌ Avoid
const User = () => {}; // Not a hook
const getUserHook = () => {}; // Wrong prefix
```

### Constants

```typescript
// ✅ Correct - UPPER_CASE for true constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// ✅ Correct - camelCase for config objects
const queryClient = new QueryClient({ /* ... */ });

// ✅ Correct - PascalCase for enum-like objects
const UserQueryKey = {
  fetchOne: 'user.fetchOne',
  fetchAll: 'user.fetchAll',
} as const;
```

### Variables

```typescript
// ✅ Correct - camelCase
const userName = 'John';
const isLoading = false;
const totalCount = 100;

// ❌ Avoid
const UserName = 'John';
const is_loading = false;
```

---

## Import Organization

Imports are **strictly ordered** and **alphabetically sorted** using `eslint-plugin-perfectionist`.

### Import Groups (in order)

1. **Side effects** (imports with no bindings)
2. **Types** (type imports)
3. **Builtin & External** (node modules, npm packages)
4. **Internal categories** (theme, hooks, navigation, translations)
5. **Components & Screens**
6. **Test utilities**
7. **Internal modules** (relative imports)
8. **Unknown** (everything else)

### Example

```typescript
// 1. Side effects
import 'react-native-gesture-handler';

// 2. Types
import type { Theme } from '@/theme/restyle';
import type { FC } from 'react';

// 3. External dependencies (alphabetically)
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 4. Internal categories
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

// 5. Components & Screens
import { Avatar, Box, Button, Text } from '@/components/atoms';
import { ItemCard, StatCard } from '@/components/molecules';
import { Example, ProfileExample, Startup } from '@/screens';

// 6. Test utilities
import { TestAppWrapper } from '@/tests/TestAppWrapper';

// 7. Internal/Relative imports
import { formatDate } from './utils';
```

### Enforced Rules

```javascript
'perfectionist/sort-imports': ['error', {
  type: 'alphabetical',
  order: 'asc',
  groups: [
    'side-effect',
    ['type', 'internal-type'],
    ['builtin', 'external'],
    ['theme', 'hooks', 'navigation', 'translations'],
    ['components', 'screens'],
    ['test'],
    'internal',
    'unknown',
  ],
}]
```

---

## File Structure Patterns

### Component Files

```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests
├── types.ts               # Component-specific types (if complex)
└── index.ts               # Barrel export
```

**Simple components can be a single file:**

```
atoms/
├── Box.tsx
├── Text.tsx
├── Button.tsx
└── index.ts
```

### Domain Hooks Pattern

```
hooks/domain/user/
├── schema.ts        # Zod schemas
├── userService.ts   # API calls
├── useUser.ts       # React Query hook
└── index.ts         # Exports
```

### Barrel Exports

Always use barrel exports (`index.ts`) for clean imports:

```typescript
// components/atoms/index.ts
export { default as Box } from './Box';
export { default as Text } from './Text';
export { default as Button } from './Button';
```

This allows:

```typescript
// ✅ Clean import
import { Box, Text, Button } from '@/components/atoms';

// ❌ Avoid
import Box from '@/components/atoms/Box';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
```

---

## Component Patterns

### 1. Restyle Components (Atoms)

```typescript
import { createBox } from '@shopify/restyle';
import type { Theme } from '@/theme/restyle';

const Box = createBox<Theme>();

export default Box;
```

### 2. Components with Props

```typescript
import React from 'react';
import Box from './Box';
import Text from './Text';
import type { Theme } from '@/theme/restyle';

type AvatarSize = 'small' | 'medium' | 'large';

type AvatarProps = {
  source: ImageSourcePropType;
  size?: AvatarSize;
  borderColor?: keyof Theme['colors'];
};

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  borderColor = 'borderPrimary',
}) => {
  return (
    <Box borderColor={borderColor} borderRadius="l" borderWidth={2}>
      <Image source={source} />
    </Box>
  );
};

export default Avatar;
```

### 3. Components with Variants

```typescript
type ProgressBarVariant = 'yellow' | 'pink';

type ProgressBarProps = {
  current: number;
  max: number;
  variant?: ProgressBarVariant;
};

const variantConfig: Record<ProgressBarVariant, { bgColor: string }> = {
  yellow: { bgColor: 'progressBgYellow' },
  pink: { bgColor: 'progressBgPink' },
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  variant = 'yellow',
}) => {
  const config = variantConfig[variant];
  // Implementation
};
```

### 4. Domain Hooks Pattern

```typescript
// 1. Schema (schema.ts)
import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

// 2. Service (userService.ts)
import { instance } from '@/services/instance';
import { userSchema } from './schema';

export const UserServices = {
  fetchOne: async (id: number) => {
    const response = await instance.get(`users/${id}`).json();
    return userSchema.parse(response);
  },
};

// 3. Hook (useUser.ts)
import { useQuery } from '@tanstack/react-query';
import { UserServices } from './userService';

const UserQueryKey = {
  fetchOne: 'user.fetchOne',
} as const;

const useFetchOneQuery = (userId: number) =>
  useQuery({
    enabled: userId >= 0,
    queryFn: () => UserServices.fetchOne(userId),
    queryKey: [UserQueryKey.fetchOne, userId],
  });

export const useUser = () => ({
  fetchOne: useFetchOneQuery,
});
```

---

## Testing Standards

### Test File Structure

```typescript
import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { TestAppWrapper } from '@/tests/TestAppWrapper';

import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />, { wrapper: TestAppWrapper });
    expect(screen.getByText('Expected Text')).toBeTruthy();
  });

  it('handles user interaction', () => {
    const onPress = jest.fn();
    render(<Component onPress={onPress} />, { wrapper: TestAppWrapper });

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Best Practices

1. **Always use TestAppWrapper** for components that need providers
2. **Test user behavior**, not implementation details
3. **Use semantic queries**: `getByRole`, `getByLabelText`, `getByText`
4. **Mock external dependencies** in `src/tests/__mocks__/`
5. **Use `jest.fn()` for callbacks**
6. **Test error states** and edge cases

### Coverage Requirements

- Minimum 80% code coverage
- All new components must have tests
- Critical business logic must be fully tested

---

## Code Review Checklist

### Before Creating a PR

- [ ] Code follows TypeScript conventions
- [ ] ESLint shows no errors (`yarn lint`)
- [ ] Prettier formatting applied (`yarn lint:fix`)
- [ ] Type checking passes (`yarn lint:type-check`)
- [ ] All tests pass (`yarn test`)
- [ ] New code has tests (>80% coverage)
- [ ] Imports are properly organized
- [ ] No console.log statements
- [ ] Magic numbers extracted to constants
- [ ] Props are properly typed
- [ ] Components use restyle theme system
- [ ] No hardcoded colors/spacing (use theme tokens)

### Code Quality

- [ ] Component follows Atomic Design principles
- [ ] Logic separated from presentation
- [ ] Reusable code extracted to hooks/utils
- [ ] Error handling implemented
- [ ] Accessibility considered
- [ ] Performance optimized (memo, useCallback where needed)

### Documentation

- [ ] Complex logic has comments
- [ ] Public APIs have JSDoc comments
- [ ] README updated if needed
- [ ] Design system docs updated for new components

### Git Commit

- [ ] Commit message follows convention
- [ ] Single responsibility per commit
- [ ] No sensitive data in commits

---

## Additional Resources

- [TypeScript Official Docs](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [@shopify/restyle Documentation](https://github.com/Shopify/restyle)
