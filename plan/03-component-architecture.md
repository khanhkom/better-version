# 03 - Component Architecture: Atomic Design Breakdown

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Dependencies:** [01-design-system-sync.md](./01-design-system-sync.md), [02-state-management.md](./02-state-management.md)
**Status:** Draft

---

## Objective

Design and build reusable components following Atomic Design methodology for farm game UI.

---

## Component Hierarchy

```
atoms/
├── ✅ Box              (Existing - Restyle container)
├── ✅ Text             (Existing - Typography)
├── ✅ Button           (Existing - Actions)
├── ✅ Avatar           (Existing - Profile pics)
├── ✅ Badge            (Existing - Notifications)
├── ✅ Card             (Existing - Containers, ADD farm variants)
├── ✅ ProgressBar      (Existing - Linear progress)
├── ❌ Emoji            (NEW - Cross-platform emoji renderer)
├── ❌ CircularProgress (NEW - SVG circular progress for Pomodoro)
├── ❌ IconButton       (NEW - Button with icon only)

molecules/
├── ✅ StatCard         (Existing - Stats display, reuse for Money/Diamonds/XP)
├── ✅ ItemCard         (Existing - Inventory items)
├── ❌ PlotCard         (NEW - Farm plot with states)
├── ❌ TabBar           (NEW - Tab switcher for modals)
├── ❌ ToolButton       (NEW - Farm tool selector)
├── ❌ CropSelector     (NEW - Dropdown crop picker)
├── ❌ ConfirmDialog    (NEW - Confirmation modal)
├── ❌ HabitItem        (NEW - Single habit row)
├── ❌ StatGrid         (NEW - 7-day habit grid)

organisms/
├── ❌ FarmGrid         (NEW - Grid of PlotCards)
├── ❌ FarmHeader       (NEW - Stats + Level display)
├── ❌ ActionToolbar    (NEW - Tool selector toolbar)
├── ❌ HabitList        (NEW - List of habits)
├── ❌ ShopGrid         (NEW - Shop items grid)
├── ❌ InventoryGrid    (NEW - Inventory display)
├── ❌ PomodoroTimer    (NEW - Circular timer UI)
├── ❌ AdviceBox        (NEW - Gemini advice display)
├── ❌ ModalWrapper     (NEW - Reusable modal container)

screens/
├── ❌ FarmGameScreen   (NEW - Main game screen)
├── ✅ ProfileExample   (Existing - Keep as reference)

modals/
├── ❌ HabitBoardModal  (NEW - Habit management)
├── ❌ FocusTimerModal  (NEW - Pomodoro timer)
├── ❌ ShopModal        (NEW - Shop + Inventory)
```

---

## New Atoms

### Emoji Component

```typescript
// src/components/atoms/Emoji.tsx
import React from 'react';
import { Text } from './Text';

type EmojiProps = {
  symbol: string;
  size?: number;
};

export const Emoji = ({ symbol, size = 24 }: EmojiProps) => (
  <Text
    fontSize={size}
    lineHeight={size}
    style={{ includeFontPadding: false }}
  >
    {symbol}
  </Text>
);
```

### CircularProgress Component

```typescript
// src/components/atoms/CircularProgress.tsx
import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Box } from './Box';

type CircularProgressProps = {
  progress: number;    // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
};

export const CircularProgress = ({
  progress,
  size = 200,
  strokeWidth = 12,
  color = '#ef5350',
  backgroundColor = '#3e2723',
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box width={size} height={size}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </Box>
  );
};
```

---

## New Molecules

### PlotCard Component

```typescript
// src/components/molecules/PlotCard.tsx
import React from 'react';
import Animated, { useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { Card } from '@/components/atoms/Card';
import { Emoji } from '@/components/atoms/Emoji';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Box } from '@/components/atoms/Box';
import type { LandPlot } from '@/types/game';
import { CROPS } from '@/constants/game';

type PlotCardProps = {
  plot: LandPlot;
  onPress: () => void;
};

export const PlotCard = ({ plot, onPress }: PlotCardProps) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (plot.status === 'PLANTED' || plot.status === 'READY') {
      rotation.value = withRepeat(withTiming(5, { duration: 1000 }), -1, true);
    }
  }, [plot.status]);

  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const crop = plot.cropId ? CROPS[plot.cropId] : null;

  return (
    <Card
      variant="farmPlot"
      onPress={onPress}
      aspectRatio={1}
      justifyContent="center"
      alignItems="center"
    >
      {plot.status === 'EMPTY' && (
        <Box opacity={0.3}>
          <Emoji symbol="🌱" size={32} />
        </Box>
      )}

      {plot.status === 'PLANTED' && crop && (
        <Animated.View style={swayStyle}>
          <Emoji symbol={crop.icon} size={40} />
          <ProgressBar progress={plot.progress} height={6} mt="s" />
        </Animated.View>
      )}

      {plot.status === 'READY' && crop && (
        <Animated.View style={swayStyle}>
          <Emoji symbol={crop.icon} size={48} />
          <Text variant="pixelBody" color="highlightYellow" mt="s">
            READY!
          </Text>
        </Animated.View>
      )}
    </Card>
  );
};
```

### TabBar Component

```typescript
// src/components/molecules/TabBar.tsx
import React from 'react';
import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';

type Tab = {
  id: string;
  label: string;
  icon?: string;
};

type TabBarProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export const TabBar = ({ tabs, activeTab, onTabChange }: TabBarProps) => (
  <Box flexDirection="row" gap="s" mb="m">
    {tabs.map((tab) => (
      <Button
        key={tab.id}
        variant={activeTab === tab.id ? 'primary' : 'farmButton'}
        onPress={() => onTabChange(tab.id)}
        flex={1}
      >
        {tab.icon} {tab.label}
      </Button>
    ))}
  </Box>
);
```

---

## New Organisms

### FarmGrid Component

```typescript
// src/components/organisms/FarmGrid.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { Box } from '@/components/atoms/Box';
import { PlotCard } from '@/components/molecules/PlotCard';
import type { LandPlot } from '@/types/game';

type FarmGridProps = {
  plots: LandPlot[];
  onPlotPress: (plotId: string) => void;
};

export const FarmGrid = ({ plots, onPlotPress }: FarmGridProps) => (
  <Box flex={1} p="m">
    <FlatList
      data={plots}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <Box flex={1}>
          <PlotCard plot={item} onPress={() => onPlotPress(item.id)} />
        </Box>
      )}
    />
  </Box>
);
```

### FarmHeader Component

```typescript
// src/components/organisms/FarmHeader.tsx
import React from 'react';
import { Box } from '@/components/atoms/Box';
import { StatCard } from '@/components/molecules/StatCard';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { usePlayerStats } from '@/hooks/usePlayerStats';

export const FarmHeader = () => {
  const { money, diamonds, xp, level } = usePlayerStats();
  const xpProgress = (xp % 100) / 100 * 100; // Simplified

  return (
    <Box p="m" gap="s" backgroundColor="farmGradientStart">
      <Box flexDirection="row" gap="s">
        <StatCard icon="💰" label="Money" value={money} variant="gold" flex={1} />
        <StatCard icon="💎" label="Diamonds" value={diamonds} variant="blue" flex={1} />
      </Box>

      <Box>
        <Text variant="farmLabel">Level {level}</Text>
        <ProgressBar progress={xpProgress} height={12} mt="xs" />
      </Box>
    </Box>
  );
};
```

---

## Component Reusability Matrix

| Component | Used In | Reusability Score | Notes |
|-----------|---------|-------------------|-------|
| Card | All screens | ⭐⭐⭐⭐⭐ | Base container, farm variants added |
| StatCard | FarmHeader, Habits | ⭐⭐⭐⭐⭐ | Reuse with different variants |
| ProgressBar | PlotCard, FarmHeader, Pomodoro | ⭐⭐⭐⭐⭐ | Linear progress everywhere |
| CircularProgress | PomodoroTimer | ⭐⭐⭐ | Specific to timer |
| PlotCard | FarmGrid | ⭐⭐⭐⭐ | Could extend for different plot types |
| TabBar | HabitModal, ShopModal | ⭐⭐⭐⭐⭐ | Reusable tab switcher |
| Emoji | All components | ⭐⭐⭐⭐⭐ | Universal emoji renderer |

---

## Props Interface Standards

### Consistent Naming
- Event handlers: `onPress`, `onChange`, `onSubmit`
- Data props: `item`, `items`, `data`
- Config props: `variant`, `size`, `color`
- State props: `isActive`, `isDisabled`, `isLoading`

### Type Safety
```typescript
// Always use explicit types
type ComponentProps = {
  required: string;
  optional?: number;
  callback: (value: string) => void;
  children?: React.ReactNode;
};

// Export types for reuse
export type { ComponentProps };
```

---

## Component Dependencies Graph

```
FarmGameScreen
├── FarmHeader
│   ├── StatCard (existing)
│   └── ProgressBar (existing)
├── FarmGrid
│   └── PlotCard
│       ├── Card (existing + farmPlot variant)
│       ├── Emoji (NEW)
│       └── ProgressBar (existing)
├── ActionToolbar
│   └── ToolButton
│       └── IconButton (NEW)
├── AdviceBox
│   ├── Card (existing + farmModal variant)
│   └── Text (existing)
└── NavigationBar
    └── Button (existing + farmButton variant)
```

---

## Implementation Checklist

### Atoms
- [ ] Extend Card with farmPlot, farmModal, farmButton variants
- [ ] Create Emoji component
- [ ] Create CircularProgress component
- [ ] Create IconButton component
- [ ] Update existing atoms with farm color support

### Molecules
- [ ] Create PlotCard with sway animation
- [ ] Create TabBar for modal navigation
- [ ] Create ToolButton for farm tools
- [ ] Create CropSelector dropdown
- [ ] Create ConfirmDialog
- [ ] Create HabitItem row
- [ ] Create StatGrid (7-day grid)

### Organisms
- [ ] Create FarmGrid with FlatList
- [ ] Create FarmHeader with stats
- [ ] Create ActionToolbar
- [ ] Create HabitList
- [ ] Create ShopGrid
- [ ] Create InventoryGrid
- [ ] Create PomodoroTimer
- [ ] Create AdviceBox
- [ ] Create ModalWrapper

### Testing
- [ ] Snapshot tests for all atoms
- [ ] Interaction tests for molecules
- [ ] Integration tests for organisms
- [ ] Storybook stories for documentation

---

## Next Steps

1. ✅ Review this plan
2. ⬜ Start with atoms (Emoji, CircularProgress, IconButton)
3. ⬜ Add farm variants to existing components
4. ⬜ Build molecules (PlotCard, TabBar, etc.)
5. ⬜ Build organisms (FarmGrid, FarmHeader, etc.)
6. ⬜ Proceed to Plan 04: Farm Screen Implementation

---

## References

- Existing components: [src/components/](../src/components/)
- Component guide: [COMPONENTS_GUIDE.md](../COMPONENTS_GUIDE.md)
- Restyle docs: https://github.com/Shopify/restyle
- Atomic Design: https://bradfrost.com/blog/post/atomic-web-design/
