# Design Guidelines

This document defines the design system, visual language, and component usage guidelines for the BetterVersion application.

## Table of Contents

- [Design System Overview](#design-system-overview)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Border Radius](#border-radius)
- [Component Variants](#component-variants)
- [Design Tokens](#design-tokens)
- [Component Usage](#component-usage)
- [Accessibility](#accessibility)
- [Dark Mode](#dark-mode)

---

## Design System Overview

BetterVersion uses **@shopify/restyle** as the foundation for its design system, providing:

- 🎨 **Type-safe theming** with TypeScript
- 📦 **Reusable design tokens** (colors, spacing, typography)
- 🔄 **Variant-based components** for consistency
- 🌙 **Dark mode** as the primary theme
- ♿ **Accessibility** built-in

### Theme Location

**Primary Theme**: `src/theme/restyle.ts`

```typescript
import theme from '@/theme/restyle';
import type { Theme } from '@/theme/restyle';
```

### Theme Provider

All components must be wrapped with `RestyleThemeProvider`:

```typescript
import RestyleThemeProvider from '@/theme/ThemeProvider/RestyleThemeProvider';

function App() {
  return (
    <RestyleThemeProvider>
      {/* Your app */}
    </RestyleThemeProvider>
  );
}
```

---

## Color Palette

### Background Colors

Dark theme with layered backgrounds for depth:

| Token | Hex | Usage |
|-------|-----|-------|
| `darkBg` | `#0A0B0F` | Main background |
| `cardBg` | `#1A1C24` | Card backgrounds |
| `cardBgLight` | `#252832` | Elevated card backgrounds |

```typescript
<Box backgroundColor="darkBg">
  <Box backgroundColor="cardBg" padding="l">
    <Box backgroundColor="cardBgLight" padding="m">
      {/* Content */}
    </Box>
  </Box>
</Box>
```

### Accent Colors

Vibrant colors for actions and highlights:

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#5CE1E6` | Primary actions, links (cyan) |
| `secondary` | `#FFD700` | Secondary actions, highlights (gold) |
| `success` | `#4ADE80` | Success states, confirmations (green) |
| `danger` | `#EF4444` | Errors, destructive actions (red) |
| `warning` | `#F59E0B` | Warnings, caution (orange) |

```typescript
<Button variant="primary" backgroundColor="success" />
<Text color="danger">Error message</Text>
<Box borderColor="secondary" borderWidth={2} />
```

### Text Colors

Hierarchical text colors for readability:

| Token | Hex | Usage |
|-------|-----|-------|
| `textPrimary` | `#FFFFFF` | Primary text, headings |
| `textSecondary` | `#A1A3A8` | Secondary text, labels |
| `textMuted` | `#6B7280` | Muted text, disabled |

```typescript
<Text color="textPrimary" variant="header">Heading</Text>
<Text color="textSecondary" variant="body">Subtitle</Text>
<Text color="textMuted" variant="caption">Muted info</Text>
```

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `borderPrimary` | `#FFD700` | Primary borders (gold) |
| `borderSecondary` | `#5CE1E6` | Secondary borders (cyan) |
| `borderDefault` | `#2A2D36` | Default borders |

```typescript
<Card borderColor="borderPrimary" borderWidth={2} />
<ItemCard borderColor="danger" /> {/* Red border */}
```

### Icon Background Colors

Specialized backgrounds for icon containers:

| Token | Hex | Description |
|-------|-----|-------------|
| `iconBgGold` | `#3D3419` | Gold icon background |
| `iconBgBlue` | `#1A2A3D` | Blue icon background |
| `iconBgOrange` | `#3D2419` | Orange icon background |
| `iconBgGreen` | `#1A3D2A` | Green icon background |

```typescript
<StatCard
  icon={<Text>💰</Text>}
  variant="gold" // Uses iconBgGold
  value="450"
  label="VÀNG"
/>
```

### Progress Bar Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `progressBgYellow` | `#3D3419` | Yellow progress background |
| `progressYellow` | `#FFD700` | Yellow progress fill |
| `progressBgPink` | `#3D1928` | Pink progress background |
| `progressPink` | `#FF1B7C` | Pink progress fill |

```typescript
<ProgressBar
  current={1250}
  max={2000}
  variant="yellow" // Uses progressYellow colors
/>
```

### Utility Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `transparent` | `transparent` | Transparent backgrounds |
| `black` | `#000000` | Pure black |
| `white` | `#FFFFFF` | Pure white |

---

## Typography

### Font Scale

All text components use the typography system from the theme:

```typescript
<Text variant="header">Header Text</Text>
<Text variant="title">Title Text</Text>
<Text variant="body">Body Text</Text>
```

### Text Variants

| Variant | Font Size | Weight | Color | Usage |
|---------|-----------|--------|-------|-------|
| `defaults` | 14px | 400 | `textPrimary` | Default text |
| `header` | 18px | 700 | `textPrimary` | Page headers |
| `title` | 16px | 600 | `textPrimary` | Section titles |
| `body` | 14px | 400 | `textPrimary` | Body text |
| `bodySecondary` | 14px | 400 | `textSecondary` | Secondary body |
| `caption` | 12px | 400 | `textSecondary` | Captions, labels |
| `label` | 12px | 600 | `textPrimary` | UPPERCASE LABELS |
| `stat` | 24px | 700 | `textPrimary` | Statistics, numbers |

### Usage Examples

```typescript
// Page header
<Text variant="header">CHIẾN BINH</Text>

// Section title
<Text variant="title">Chiến binh Hảo</Text>

// Body text
<Text variant="body">Regular content text</Text>

// Secondary info
<Text variant="bodySecondary">Supporting information</Text>

// Small captions
<Text variant="caption">Additional details</Text>

// Uppercase labels
<Text variant="label">KINH NGHIỆM</Text>

// Large numbers
<Text variant="stat">450</Text>
```

### Custom Text Styling

You can override text properties:

```typescript
<Text
  variant="body"
  color="primary"
  fontSize={16}
  fontWeight="700"
  textAlign="center"
>
  Custom styled text
</Text>
```

### Text Transform

```typescript
// Label variant automatically uses uppercase
<Text variant="label">vàng</Text> // Renders as "VÀNG"

// Manual transform
<Text textTransform="uppercase">text</Text>
<Text textTransform="lowercase">TEXT</Text>
<Text textTransform="capitalize">hello world</Text>
```

---

## Spacing System

Consistent spacing scale based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Minimal spacing |
| `s` | 8px | Small spacing |
| `m` | 12px | Medium spacing |
| `l` | 16px | Large spacing |
| `xl` | 20px | Extra large spacing |
| `xxl` | 24px | 2x extra large |
| `xxxl` | 32px | 3x extra large |

### Spacing Props

```typescript
// Margin
<Box margin="l">         {/* 16px all sides */}
<Box marginTop="xl">     {/* 20px top */}
<Box marginBottom="xxl"> {/* 24px bottom */}
<Box marginHorizontal="m"> {/* 12px left & right */}
<Box marginVertical="l">   {/* 16px top & bottom */}

// Padding
<Box padding="l">         {/* 16px all sides */}
<Box paddingTop="xs">     {/* 4px top */}
<Box paddingHorizontal="s"> {/* 8px left & right */}

// Gap (for flexbox)
<Box flexDirection="row" gap="m"> {/* 12px gap */}
  <Box />
  <Box />
</Box>
```

### Spacing Guidelines

**Recommended spacing for common use cases**:

- **Between sections**: `xl` or `xxl` (20-24px)
- **Between components**: `l` (16px)
- **Between related items**: `m` (12px)
- **Inner component padding**: `l` or `m` (12-16px)
- **Tight spacing**: `s` or `xs` (4-8px)

```typescript
// Example: Profile screen layout
<Box padding="l">                        {/* Screen padding: 16px */}
  <Box marginBottom="xl">                {/* Header section: 20px */}
    <Text variant="header">Header</Text>
  </Box>

  <Box marginBottom="xl">                {/* Stats section: 20px */}
    <Box flexDirection="row" gap="m">    {/* Between cards: 12px */}
      <StatCard />
      <StatCard />
    </Box>
  </Box>

  <Box marginBottom="xl">                {/* Progress section: 20px */}
    <ProgressBar />
  </Box>
</Box>
```

---

## Border Radius

Rounded corners for visual hierarchy:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Minimal rounding |
| `s` | 8px | Small elements |
| `m` | 12px | Medium elements |
| `l` | 16px | Large elements, cards |
| `xl` | 20px | Extra large rounding |
| `xxl` | 24px | Very round corners |
| `full` | 9999px | Fully rounded (pills, circles) |

### Usage Examples

```typescript
// Card corners
<Card borderRadius="l">   {/* 16px - standard cards */}

// Button (pill shape)
<Button borderRadius="full">  {/* Fully rounded */}

// Avatar
<Avatar borderRadius="l">     {/* 16px - slightly rounded */}

// Badge
<Badge borderRadius="full">   {/* Circle/pill */}

// Small elements
<Box borderRadius="s">        {/* 8px */}
```

---

## Component Variants

### Button Variants

```typescript
type ButtonVariant = 'defaults' | 'primary' | 'secondary' | 'outlined';
```

| Variant | Background | Usage |
|---------|------------|-------|
| `defaults` | `primary` (#5CE1E6) | Default button |
| `primary` | `success` (#4ADE80) | Main actions (green) |
| `secondary` | `cardBgLight` (#252832) | Secondary actions |
| `outlined` | `transparent` | Outlined style |

```typescript
<Button variant="primary" title="NHẬN THƯỞNG" />
<Button variant="secondary" title="Cancel" />
<Button variant="outlined" title="More" />
```

### Card Variants

```typescript
type CardVariant = 'defaults' | 'elevated' | 'bordered' | 'stat';
```

| Variant | Style | Usage |
|---------|-------|-------|
| `defaults` | Basic card | Standard cards |
| `elevated` | With shadow | Important cards |
| `bordered` | With border | Outlined cards |
| `stat` | Bordered, centered | Stat cards |

```typescript
<Card variant="defaults">
  <Text>Basic card</Text>
</Card>

<Card variant="elevated">
  <Text>Elevated card with shadow</Text>
</Card>

<Card variant="bordered">
  <Text>Card with border</Text>
</Card>
```

### StatCard Variants

```typescript
type StatCardVariant = 'gold' | 'blue' | 'orange';
```

| Variant | Icon BG | Icon Color | Usage |
|---------|---------|------------|-------|
| `gold` | `iconBgGold` | `secondary` | Gold/currency stats |
| `blue` | `iconBgBlue` | `primary` | Gems/premium stats |
| `orange` | `iconBgOrange` | `warning` | Streak/fire stats |

```typescript
<StatCard
  variant="gold"
  icon={<Text fontSize={24}>💰</Text>}
  value="450"
  label="VÀNG"
  borderColor="secondary"
/>
```

### ProgressBar Variants

```typescript
type ProgressBarVariant = 'yellow' | 'pink';
```

| Variant | Colors | Usage |
|---------|--------|-------|
| `yellow` | Gold theme | Experience, energy |
| `pink` | Pink theme | Health, love |

```typescript
<ProgressBar
  current={1250}
  max={2000}
  variant="yellow"
  label="KINH NGHIỆM"
  icon={<Text>⚡</Text>}
/>

<ProgressBar
  current={85}
  max={100}
  variant="pink"
  label="SỨC KHỎE"
  icon={<Text>❤️</Text>}
/>
```

---

## Design Tokens

### Complete Token Reference

```typescript
// Colors
theme.colors.darkBg
theme.colors.cardBg
theme.colors.cardBgLight
theme.colors.primary
theme.colors.secondary
theme.colors.success
theme.colors.danger
theme.colors.warning
theme.colors.textPrimary
theme.colors.textSecondary
theme.colors.textMuted
theme.colors.borderPrimary
theme.colors.borderSecondary
theme.colors.borderDefault

// Spacing
theme.spacing.xs    // 4px
theme.spacing.s     // 8px
theme.spacing.m     // 12px
theme.spacing.l     // 16px
theme.spacing.xl    // 20px
theme.spacing.xxl   // 24px
theme.spacing.xxxl  // 32px

// Border Radius
theme.borderRadii.xs    // 4px
theme.borderRadii.s     // 8px
theme.borderRadii.m     // 12px
theme.borderRadii.l     // 16px
theme.borderRadii.xl    // 20px
theme.borderRadii.xxl   // 24px
theme.borderRadii.full  // 9999px

// Text Variants
theme.textVariants.defaults
theme.textVariants.header
theme.textVariants.title
theme.textVariants.body
theme.textVariants.bodySecondary
theme.textVariants.caption
theme.textVariants.label
theme.textVariants.stat

// Component Variants
theme.buttonVariants.defaults
theme.buttonVariants.primary
theme.buttonVariants.secondary
theme.buttonVariants.outlined

theme.cardVariants.defaults
theme.cardVariants.elevated
theme.cardVariants.bordered
theme.cardVariants.stat
```

### Accessing Tokens in Code

```typescript
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/theme/restyle';

function MyComponent() {
  const theme = useTheme<Theme>();

  const primaryColor = theme.colors.primary;
  const largeSpacing = theme.spacing.l;

  return (
    <View style={{ backgroundColor: primaryColor, padding: largeSpacing }}>
      {/* Content */}
    </View>
  );
}
```

---

## Component Usage

### Box Component

The foundational layout component:

```typescript
import { Box } from '@/components/atoms';

// Container
<Box
  backgroundColor="cardBg"
  padding="l"
  borderRadius="l"
>
  {/* Content */}
</Box>

// Flexbox layout
<Box
  flexDirection="row"
  justifyContent="space-between"
  alignItems="center"
  gap="m"
>
  <Box flex={1} />
  <Box flex={1} />
</Box>

// Absolute positioning
<Box position="absolute" top={10} right={10}>
  <Badge count={3} />
</Box>
```

### Text Component

All text should use the Text component:

```typescript
import { Text } from '@/components/atoms';

<Text variant="header">Page Header</Text>
<Text variant="title" color="primary">Colored Title</Text>
<Text variant="body" textAlign="center">Centered text</Text>
<Text variant="label">UPPERCASE LABEL</Text>
```

### Avatar Component

Profile pictures with borders:

```typescript
import { Avatar } from '@/components/atoms';

<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="large"
  borderColor="borderPrimary"
/>

// Sizes: 'small' (40px), 'medium' (60px), 'large' (100px)
```

### Badge Component

Notification badges:

```typescript
import { Badge } from '@/components/atoms';

<Badge count={3} />
<Badge count={99} />
<Badge count={150} /> {/* Shows "99+" */}

// Custom colors
<Badge
  count={5}
  backgroundColor="primary"
  textColor="black"
/>
```

### Button Component

Action buttons:

```typescript
import { Button } from '@/components/atoms';

<Button
  variant="primary"
  title="NHẬN THƯỞNG"
  onPress={handlePress}
/>

<Button
  variant="secondary"
  title="Cancel"
  onPress={handleCancel}
/>

<Button
  variant="outlined"
  title="More Info"
  onPress={handleInfo}
/>
```

### ProgressBar Component

Progress indicators:

```typescript
import { ProgressBar } from '@/components/atoms';

<ProgressBar
  current={1250}
  max={2000}
  variant="yellow"
  label="KINH NGHIỆM"
  icon={<Text fontSize={16}>⚡</Text>}
  caption="Thiếu 750 XP đi lên cấp"
/>
```

### StatCard Component

Statistics display:

```typescript
import { StatCard } from '@/components/molecules';

<StatCard
  icon={<Text fontSize={24}>💰</Text>}
  value="450"
  label="VÀNG"
  variant="gold"
  borderColor="secondary"
/>
```

### ItemCard Component

Inventory/item cards:

```typescript
import { ItemCard } from '@/components/molecules';

<ItemCard
  image={{ uri: 'https://example.com/sword.png' }}
  name="Kiếm sắt"
  status="Đã trang bị"
  isEquipped
  onPress={handleItemPress}
/>

<ItemCard
  image={{ uri: 'https://example.com/potion.png' }}
  name="Bình máu"
  status="HỒI PHỤC"
  badgeCount={3}
  borderColor="danger"
/>
```

---

## Accessibility

### Color Contrast

All text colors meet WCAG AA standards:

- `textPrimary` (#FFFFFF) on `darkBg` (#0A0B0F): 21:1 ✅
- `textSecondary` (#A1A3A8) on `darkBg` (#0A0B0F): 9.5:1 ✅
- `primary` (#5CE1E6) on `darkBg` (#0A0B0F): 11:1 ✅

### Touch Targets

Minimum touch target size: **44x44 px** (iOS HIG)

```typescript
// Buttons automatically have proper sizing
<Button title="Click" /> // Meets 44px minimum

// For custom touchables
<TouchableOpacity style={{ minWidth: 44, minHeight: 44 }}>
  <Icon />
</TouchableOpacity>
```

### Semantic Components

Use semantic HTML-like components:

```typescript
// Good
<Button title="Submit" onPress={handleSubmit} />
<Text variant="header">Page Title</Text>

// Avoid
<TouchableOpacity><Text>Submit</Text></TouchableOpacity>
```

### Accessibility Props

```typescript
<Button
  title="Delete"
  onPress={handleDelete}
  accessibilityLabel="Delete item"
  accessibilityHint="Removes this item from your inventory"
  accessibilityRole="button"
/>

<Avatar
  source={{ uri: avatarUrl }}
  accessibilityLabel="User profile picture"
  accessibilityRole="image"
/>
```

---

## Dark Mode

### Primary Theme

BetterVersion uses **dark mode as the primary theme**:

- Dark backgrounds reduce eye strain
- Vibrant accent colors pop on dark
- Better for gaming/entertainment apps
- OLED-friendly (battery saving)

### Color Strategy

**Layered backgrounds** create depth:

```
Level 1 (Main):      darkBg      (#0A0B0F) ← Darkest
Level 2 (Cards):     cardBg      (#1A1C24) ← Mid
Level 3 (Elevated):  cardBgLight (#252832) ← Lightest
```

**Vibrant accents** for contrast:

- Cyan (`primary`) for links and primary actions
- Gold (`secondary`) for highlights and value
- Green (`success`) for positive actions
- Red (`danger`) for errors and warnings

### Example: Dark Mode Card

```typescript
<Box backgroundColor="darkBg" flex={1} padding="l">
  <Box backgroundColor="cardBg" borderRadius="l" padding="l">
    <Text variant="header" color="textPrimary">
      Dark Mode Card
    </Text>
    <Text variant="body" color="textSecondary">
      Readable text on dark background
    </Text>

    <Button variant="primary" title="Action" />
  </Box>
</Box>
```

---

## Design Best Practices

### 1. Consistency

Always use theme tokens instead of hardcoded values:

```typescript
// ✅ Good
<Box backgroundColor="cardBg" padding="l" borderRadius="l" />

// ❌ Bad
<Box backgroundColor="#1A1C24" padding={16} borderRadius={16} />
```

### 2. Hierarchy

Use spacing and typography to create visual hierarchy:

```typescript
<Box>
  <Text variant="header" marginBottom="xl">Main Title</Text>
  <Text variant="title" marginBottom="l">Section Title</Text>
  <Text variant="body" marginBottom="m">Body text</Text>
  <Text variant="caption">Small caption</Text>
</Box>
```

### 3. Spacing

Follow the 4px grid system:

```typescript
// ✅ Good - uses spacing tokens
<Box marginTop="l" marginBottom="xl" />

// ❌ Bad - custom values
<Box marginTop={17} marginBottom={23} />
```

### 4. Variants

Use component variants for consistency:

```typescript
// ✅ Good
<Button variant="primary" title="Submit" />
<StatCard variant="gold" value="450" />

// ❌ Bad - custom styling
<TouchableOpacity style={{ backgroundColor: '#4ADE80', padding: 16 }}>
  <Text style={{ color: '#FFF', fontWeight: '700' }}>Submit</Text>
</TouchableOpacity>
```

### 5. Responsive Design

Use flex and percentage-based layouts:

```typescript
<Box flexDirection="row" gap="m">
  <Box flex={1}><StatCard /></Box>
  <Box flex={1}><StatCard /></Box>
  <Box flex={1}><StatCard /></Box>
</Box>
```

---

## Resources

- **Theme File**: `src/theme/restyle.ts`
- **Component Examples**: `src/screens/ProfileExample.tsx`
- **Components Guide**: `../COMPONENTS_GUIDE.md`
- **@shopify/restyle Docs**: https://github.com/Shopify/restyle

---

## Summary

The BetterVersion design system provides:

✅ **Consistent visual language** across the app
✅ **Type-safe theming** with @shopify/restyle
✅ **Dark mode optimized** color palette
✅ **Accessible** color contrasts and touch targets
✅ **Flexible** component variants
✅ **Scalable** spacing and typography system

Follow these guidelines to maintain design consistency and create beautiful, accessible user interfaces.
