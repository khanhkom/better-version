# Codebase Summary

BetterVersion - A modern React Native application built with TypeScript, featuring a comprehensive design system and robust architecture.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Key Dependencies](#key-dependencies)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Build & Deployment](#build--deployment)

---

## Project Overview

**BetterVersion** is a React Native mobile application that demonstrates modern mobile development best practices:

- 🎨 **Design System** powered by @shopify/restyle
- 🧩 **Atomic Design** component architecture
- 📱 **React Native 0.80.2** with React 19.1.0
- 🔷 **TypeScript** strict mode
- 🎯 **Type-safe** navigation and state management
- 🧪 **Comprehensive testing** setup
- 🌐 **Internationalization** support (i18next)
- ⚡ **High performance** with optimized libraries

---

## Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.80.2 | Mobile framework |
| React | 19.1.0 | UI library |
| TypeScript | 5.8.2 | Type safety |
| Node.js | >=20.12 | Runtime requirement |

### Navigation

| Technology | Version | Purpose |
|------------|---------|---------|
| @react-navigation/native | 7.1.16 | Navigation framework |
| @react-navigation/stack | 7.4.4 | Stack navigator |
| react-native-screens | 4.13.1 | Native screen optimization |
| react-native-safe-area-context | 5.5.2 | Safe area handling |

### UI & Design System

| Technology | Version | Purpose |
|------------|---------|---------|
| @shopify/restyle | 2.4.5 | 🎯 **Primary theming system** |
| @shopify/react-native-skia | 2.4.14 | Graphics & canvas |
| @shopify/flash-list | 2.2.0 | Optimized lists |
| react-native-svg | 15.12.1 | SVG support |
| react-native-reanimated | 4.0.1 | Smooth animations |
| react-native-gesture-handler | 2.27.2 | Gesture system |

### State Management & Data

| Technology | Version | Purpose |
|------------|---------|---------|
| zustand | 5.0.9 | Global state management |
| @tanstack/react-query | 5.84.0 | Server state & caching |
| react-native-mmkv | 3.3.0 | Fast local storage |
| ky | 1.8.2 | HTTP client |
| zod | 4.0.14 | Runtime validation |

### Internationalization

| Technology | Version | Purpose |
|------------|---------|---------|
| i18next | 25.3.2 | i18n framework |
| react-i18next | 15.6.1 | React bindings |
| intl-pluralrules | 2.0.1 | Pluralization |

### Developer Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.32.0 | Code linting |
| Prettier | 3.6.2 | Code formatting |
| Jest | 29.7.0 | Testing framework |
| @testing-library/react-native | 13.2.2 | Component testing |
| Reactotron | 5.1.12 | Debugging |

---

## Directory Structure

```
BetterVersion/
├── .claude/                    # Claude Code workflows & config
├── android/                    # Android native code
├── ios/                        # iOS native code
├── docs/                       # 📚 Project documentation
│   ├── code-standards.md
│   ├── codebase-summary.md
│   ├── design-guidelines.md
│   └── system-architecture.md
├── src/                        # 🎯 Main source code
│   ├── components/             # UI Components (Atomic Design)
│   │   ├── atoms/             # Basic building blocks
│   │   │   ├── AssetByVariant/
│   │   │   ├── IconByVariant/
│   │   │   ├── Skeleton/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Box.tsx        # 🎯 Core restyle component
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Text.tsx       # 🎯 Core restyle component
│   │   │   └── index.ts
│   │   ├── molecules/         # Composed components
│   │   │   ├── DefaultError/
│   │   │   ├── ItemCard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── index.ts
│   │   ├── organisms/         # Complex compositions
│   │   │   ├── ErrorBoundary/
│   │   │   └── index.ts
│   │   └── templates/         # Page layouts
│   │       ├── SafeScreen/
│   │       └── index.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── domain/            # Domain-specific hooks
│   │   │   └── user/
│   │   │       ├── schema.ts      # Zod schemas
│   │   │       ├── userService.ts # API calls
│   │   │       └── useUser.ts     # React Query hook
│   │   ├── language/
│   │   │   ├── schema.ts
│   │   │   └── useI18n.ts
│   │   └── index.ts
│   ├── navigation/             # Navigation configuration
│   │   ├── Application.tsx     # Main navigator
│   │   ├── paths.ts           # Route constants
│   │   └── types.ts           # Navigation types
│   ├── screens/                # Screen components
│   │   ├── Example/
│   │   ├── Startup/
│   │   ├── ProfileExample.tsx  # Demo screen
│   │   └── index.ts
│   ├── services/               # API services
│   │   └── instance.ts        # Ky HTTP client setup
│   ├── tests/                  # Test utilities
│   │   ├── __mocks__/
│   │   │   └── libs/
│   │   └── TestAppWrapper.tsx
│   ├── theme/                  # Theme configuration
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── hooks/
│   │   │   └── useTheme.ts
│   │   ├── ThemeProvider/
│   │   │   ├── RestyleThemeProvider.tsx  # 🎯 Restyle provider
│   │   │   └── ThemeProvider.tsx         # Legacy provider
│   │   ├── types/
│   │   ├── restyle.ts          # 🎯 NEW @shopify/restyle theme
│   │   ├── _config.ts          # Legacy theme config
│   │   ├── backgrounds.ts
│   │   ├── borders.ts
│   │   ├── fonts.ts
│   │   ├── gutters.ts
│   │   ├── layout.ts
│   │   └── index.ts
│   ├── translations/           # i18n translations
│   │   ├── en-EN.json
│   │   ├── fr-FR.json
│   │   └── index.ts
│   ├── App.tsx                # Root component
│   └── reactotron.config.ts   # Reactotron setup
├── .env                       # Environment variables
├── .eslintrc.mjs             # ESLint configuration
├── .prettierrc.mjs           # Prettier configuration
├── babel.config.js           # Babel configuration
├── jest.config.js            # Jest configuration
├── metro.config.js           # Metro bundler config
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── CLAUDE.md                 # Claude Code instructions
├── COMPONENTS_GUIDE.md       # Component usage guide
└── README.md                 # Project README
```

### Key Directories Explained

#### `src/components/` (Atomic Design)

- **atoms/**: Basic building blocks (Box, Text, Button, Avatar, etc.)
- **molecules/**: Composed components (StatCard, ItemCard)
- **organisms/**: Complex compositions (ErrorBoundary)
- **templates/**: Page layouts (SafeScreen)

#### `src/hooks/domain/`

Domain-driven hook organization following the pattern:
```
domain/entity/
├── schema.ts        # Zod validation schemas
├── entityService.ts # API service layer
└── useEntity.ts     # React Query hooks
```

#### `src/theme/`

**Dual theme system**:
1. **Legacy theme** (`_config.ts`, `backgrounds.ts`, etc.) - Older implementation
2. **Restyle theme** (`restyle.ts`) - 🎯 **NEW, actively used**

#### `src/navigation/`

Type-safe navigation with React Navigation:
- `paths.ts`: Route name constants
- `types.ts`: Navigation param types
- `Application.tsx`: Main navigator setup

---

## Key Dependencies

### UI Components (@shopify/restyle)

**Core Philosophy**: Type-safe, theme-driven component styling

```typescript
import { createBox, createText } from '@shopify/restyle';
import type { Theme } from '@/theme/restyle';

const Box = createBox<Theme>();
const Text = createText<Theme>();
```

**Benefits**:
- Type-safe theme access
- Consistent spacing/colors
- Responsive design support
- Variant-based styling

### State Management (Zustand)

Simple, fast, and scalable state management:

```typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Data Fetching (@tanstack/react-query)

Server state management with caching:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});
```

### HTTP Client (Ky)

Modern fetch wrapper with better error handling:

```typescript
import { instance } from '@/services/instance';

const user = await instance.get('users/1').json();
```

### Validation (Zod)

Runtime type validation:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

const user = userSchema.parse(data); // Throws if invalid
```

### Internationalization (i18next)

Multi-language support:

```typescript
import { useI18n } from '@/hooks/language';

const { t, changeLanguage } = useI18n();

<Text>{t('welcome.title')}</Text>
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.12
- Yarn package manager
- React Native development environment
  - For iOS: Xcode, CocoaPods
  - For Android: Android Studio, JDK

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BetterVersion

# Install dependencies
yarn install

# iOS: Install pods
cd ios && pod install && cd ..
```

### Environment Setup

Create a `.env` file in the root directory:

```env
API_URL=https://jsonplaceholder.typicode.com
```

### Running the App

```bash
# Start Metro bundler
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

### First Time Setup

The app will launch with the `ProfileExample` screen demonstrating all components:

- Avatar with level badge
- Stat cards (Gold, Gems, Streak)
- Progress bars (Experience, Health)
- Item cards (Inventory items)
- Buttons and other UI elements

---

## Development Workflow

### 1. Code with Linting

```bash
# Check for linting errors
yarn lint:rules

# Check code formatting
yarn lint:code-format

# Check TypeScript types
yarn lint:type-check

# Run all lint checks
yarn lint
```

### 2. Auto-fix Issues

```bash
# Fix all auto-fixable issues
yarn lint:fix
```

This will:
- Fix ESLint rule violations
- Format code with Prettier
- Run TypeScript type checking

### 3. Running Tests

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:report

# Watch mode
yarn test --watch
```

### 4. Component Development

1. Create component in appropriate atomic level (`atoms/`, `molecules/`, etc.)
2. Export from `index.ts`
3. Write tests in `.test.tsx` file
4. Use in screens

Example:

```bash
# Create new atom
src/components/atoms/NewComponent.tsx
src/components/atoms/NewComponent.test.tsx

# Export
src/components/atoms/index.ts
```

### 5. Adding a New Screen

1. Create screen in `src/screens/ScreenName/`
2. Add route to `src/navigation/paths.ts`
3. Add type to `src/navigation/types.ts`
4. Register in `src/navigation/Application.tsx`
5. Export from `src/screens/index.ts`

### 6. Debugging

```bash
# Start with Reactotron debugging
yarn start

# Open Reactotron desktop app to view:
# - State changes
# - API requests
# - Async storage
# - React Query cache
```

---

## Build & Deployment

### Development Builds

```bash
# iOS Debug
yarn ios

# Android Debug
yarn android
```

### Release Builds

#### iOS

```bash
# Build release version
cd ios
xcodebuild -workspace BetterVersion.xcworkspace \
           -scheme BetterVersion \
           -configuration Release \
           -archivePath ./build/BetterVersion.xcarchive \
           archive
```

#### Android

```bash
# Build release APK
cd android
./gradlew assembleRelease

# Build AAB for Play Store
./gradlew bundleRelease
```

### Testing Production Builds

```bash
# iOS Release on simulator
yarn ios --configuration Release

# Android Release on emulator
yarn android --variant=release
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `yarn start` | Start Metro bundler |
| `yarn android` | Run on Android device/emulator |
| `yarn ios` | Run on iOS device/simulator |
| `yarn test` | Run Jest tests |
| `yarn test:report` | Run tests with coverage report |
| `yarn lint` | Run all linting checks |
| `yarn lint:fix` | Auto-fix linting issues |
| `yarn lint:rules` | Check ESLint rules |
| `yarn lint:code-format` | Check Prettier formatting |
| `yarn lint:type-check` | Check TypeScript types |
| `yarn pod-install` | Install iOS CocoaPods |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Backend API base URL | `https://api.example.com` |

---

## Project Stats

- **Total Components**: 15+ reusable components
- **Test Coverage**: Target 80%+
- **Type Safety**: 100% TypeScript
- **ESLint Rules**: Extremely strict (unicorn:all + react:all)
- **Languages**: English, French (i18next)

---

## Additional Resources

- [Code Standards](./code-standards.md) - Coding conventions and best practices
- [System Architecture](./system-architecture.md) - Technical architecture details
- [Design Guidelines](./design-guidelines.md) - Design system documentation
- [Components Guide](../COMPONENTS_GUIDE.md) - Component usage examples

---

## Contributing

1. Follow the [Code Standards](./code-standards.md)
2. Write tests for new features
3. Ensure all linting passes
4. Update documentation as needed
5. Create detailed pull requests

---

## Support & Documentation

- **Project Documentation**: `./docs/`
- **Component Examples**: `src/screens/ProfileExample.tsx`
- **Claude Code Workflows**: `./.claude/workflows/`

For questions or issues, refer to the project documentation or create an issue in the repository.
