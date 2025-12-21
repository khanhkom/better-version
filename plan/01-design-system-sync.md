# 01 - Design System Sync: Web → Mobile

**Date:** 2025-12-22
**Priority:** 🔴 P0
**Dependencies:** None
**Status:** Draft

---

## Objective

Extend mobile app's Restyle theme to include web UI's farm-themed design tokens while maintaining dark mode compatibility and ensuring visual consistency.

---

## Current Design Systems

### Web Design System (Tailwind)

**Color Palette:**
```css
/* Background */
--farm-gradient-start: #2d5a27;  /* Dark forest green */
--farm-gradient-end: #3a7332;    /* Medium forest green */
--farm-board: #4caf50;           /* Bright green (Material) */

/* Borders & Accents */
--border-dark: #5d4037;          /* Dark brown */
--border-darker: #3e2723;        /* Darker brown */
--card-bg: #8d6e63;              /* Medium brown */
--card-bg-light: #d7ccc8;        /* Light brown */

/* Feature Colors */
--pomodoro-focus: #ef5350;       /* Red (focus mode) */
--pomodoro-break: #66bb6a;       /* Green (break mode) */
--storage-accent: #56ccf2;       /* Cyan (storage modal) */
--highlight-orange: #ff9800;     /* Orange */
--highlight-yellow: #ffb300;     /* Yellow */
--gold: #ffd700;                 /* Gold */

/* Text */
--text-dark: #1a1a1a;
--text-light: #ffffff;
```

**Typography:**
```css
Font Family:
  - Headings: "Press Start 2P" (pixel font, 400 weight)
  - Body: "Quicksand" (sans-serif, 300-700 weight)

Font Sizes (Tailwind):
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
```

**Spacing (Tailwind 4px grid):**
```css
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 6: 24px
- 8: 32px
- 12: 48px
- 16: 64px
```

**Border Radius:**
```css
- rounded: 4px
- rounded-md: 6px
- rounded-lg: 8px
- rounded-xl: 12px
- rounded-2xl: 16px
- rounded-3xl: 24px
- rounded-full: 9999px
```

**Shadows:**
```css
- shadow-md: 0 4px 6px rgba(0,0,0,0.1)
- shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
- shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Mobile Design System (Restyle)

**Current Theme ([src/theme/restyle.ts](../src/theme/restyle.ts)):**
```typescript
colors: {
  // Dark mode palette
  darkBg: '#0A0B0F',
  cardBg: '#1A1C24',
  cardBgLight: '#252832',

  // Brand colors
  primary: '#5CE1E6',      // Cyan
  secondary: '#FFD700',    // Gold

  // Semantic colors
  success: '#4ADE80',      // Green
  danger: '#EF4444',       // Red
  warning: '#F59E0B',      // Orange
  info: '#3B82F6',         // Blue

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#6B7280',
}

spacing: {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

borderRadii: {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
}
```

---

## Design Sync Strategy

### 1. Color Token Additions

Add farm-specific colors while preserving existing dark theme:

```typescript
// src/theme/restyle.ts - UPDATED
export const colors = {
  // Existing dark mode colors (keep all)
  darkBg: '#0A0B0F',
  cardBg: '#1A1C24',
  cardBgLight: '#252832',
  primary: '#5CE1E6',
  secondary: '#FFD700',
  success: '#4ADE80',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#6B7280',

  // NEW: Farm theme colors
  farmGradientStart: '#2d5a27',
  farmGradientEnd: '#3a7332',
  farmBoard: '#4caf50',
  farmBorder: '#5d4037',
  farmBorderDark: '#3e2723',
  farmCardBg: '#8d6e63',
  farmCardBgLight: '#d7ccc8',

  // NEW: Feature-specific colors
  focusRed: '#ef5350',
  breakGreen: '#66bb6a',
  storageCyan: '#56ccf2',
  highlightOrange: '#ff9800',
  highlightYellow: '#ffb300',
  gold: '#ffd700',

  // NEW: Crop colors (for visual distinction)
  cropTomato: '#ff6347',
  cropCarrot: '#ff8c00',
  cropCorn: '#ffeb3b',
  cropWatermelon: '#e91e63',
};
```

**Rationale:**
- Keep existing dark colors for non-farm screens
- Add farm colors with `farm` prefix for clarity
- Add semantic colors (focus, break, storage) for specific features
- No breaking changes to existing components

### 2. Typography Strategy

**Challenge:** Press Start 2P is pixel font, may not render well on mobile

**Options:**

**A. Custom Font (Recommended if licensing allows)**
```typescript
// Install font
// yarn add @expo-google-fonts/press-start-2p

// src/theme/fonts.ts
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export const fontConfig = {
  pixel: {
    regular: {
      fontFamily: 'PressStart2P_400Regular',
      fontWeight: '400',
    },
  },
  body: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    semibold: {
      fontFamily: 'System',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
};
```

**B. System Font Fallback (If licensing unclear)**
```typescript
// Use monospace as pixel font alternative
export const fontConfig = {
  pixel: {
    regular: {
      fontFamily: Platform.select({
        ios: 'Courier New',
        android: 'monospace',
      }),
      fontWeight: '700',
      letterSpacing: 1,
    },
  },
  body: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
  },
};
```

**Decision:** Start with Option B (system font), upgrade to Option A if needed

**Text Variant Updates:**
```typescript
// src/theme/restyle.ts
textVariants: {
  // Existing variants (keep all)
  defaults: { ... },
  header: { ... },
  body: { ... },

  // NEW: Farm-specific variants
  pixelHeader: {
    fontFamily: 'pixel.regular',
    fontSize: 20,
    lineHeight: 28,
    color: 'textPrimary',
    textTransform: 'uppercase',
  },
  pixelBody: {
    fontFamily: 'pixel.regular',
    fontSize: 12,
    lineHeight: 18,
    color: 'textPrimary',
  },
  farmLabel: {
    fontFamily: 'body.semibold',
    fontSize: 14,
    color: 'farmCardBgLight',
  },
}
```

### 3. Spacing - Already Compatible ✅

Both systems use 4px grid → No changes needed

**Mapping:**
- Tailwind `p-1` (4px) = Restyle `xs` (4)
- Tailwind `p-2` (8px) = Restyle `s` (8)
- Tailwind `p-3` (12px) = Restyle `m` (12)
- Tailwind `p-4` (16px) = Restyle `l` (16)
- etc.

### 4. Border Radius - Already Compatible ✅

**Mapping:**
- Tailwind `rounded-lg` (8px) = Restyle `s` (8)
- Tailwind `rounded-xl` (12px) = Restyle `m` (12)
- Tailwind `rounded-2xl` (16px) = Restyle `l` (16)
- Tailwind `rounded-3xl` (24px) = Restyle `xxl` (24)
- Tailwind `rounded-full` (9999px) = Restyle `full` (9999)

### 5. Shadows & Elevation

Add shadow variants for farm components:

```typescript
// src/theme/restyle.ts
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};
```

### 6. Card Variants

Extend existing Card component with farm variants:

```typescript
// src/components/atoms/Card.tsx - NEW VARIANTS
cardVariants: {
  defaults: { ... },
  elevated: { ... },
  outlined: { ... },

  // NEW: Farm variants
  farmPlot: {
    backgroundColor: 'farmBoard',
    borderColor: 'farmBorder',
    borderWidth: 4,
    borderRadius: 'l',
    padding: 's',
  },
  farmModal: {
    backgroundColor: 'farmCardBg',
    borderColor: 'farmBorderDark',
    borderWidth: 8,
    borderRadius: 'xxl',
    padding: 'l',
  },
  farmButton: {
    backgroundColor: 'farmCardBgLight',
    borderColor: 'farmBorder',
    borderWidth: 2,
    borderRadius: 'xl',
    padding: 'm',
  },
}
```

---

## Component-Specific Design Patterns

### Pattern 1: Pixel Art Aesthetic

**Web Pattern:**
- Thick borders (2-8px)
- Bright, saturated colors
- Hard corners (no sub-pixel anti-aliasing)
- Emoji as primary icons
- Sway animation on crops

**Mobile Implementation:**
```typescript
// PlotCard component
<Box
  borderWidth={4}
  borderColor="farmBorder"
  borderRadius="l"
  backgroundColor="farmBoard"
  aspectRatio={1}
>
  <Text fontSize={40}>{cropEmoji}</Text>
  {/* Sway animation with Reanimated */}
</Box>
```

### Pattern 2: Modal Overlays

**Web Pattern:**
- Full-screen modal
- Backdrop blur + dark overlay
- Large close button (top-right)
- Rounded corners (2xl-3xl)
- Brown card background

**Mobile Implementation:**
```typescript
// Modal component
<Modal transparent animationType="fade">
  <BlurView intensity={80} style={styles.backdrop}>
    <Box
      backgroundColor="farmCardBg"
      borderRadius="xxl"
      borderWidth={8}
      borderColor="farmBorderDark"
      padding="l"
    >
      {/* Modal content */}
    </Box>
  </BlurView>
</Modal>
```

### Pattern 3: Progress Visualization

**Web Pattern:**
- Linear progress bars with gradient
- Circular SVG progress (Pomodoro)
- Percentage text overlay
- Animated transitions

**Mobile Implementation:**
```typescript
// Use existing ProgressBar component + new CircularProgress
<ProgressBar
  progress={cropProgress}
  height={8}
  backgroundColor="farmBorder"
  progressColor="highlightYellow"
  borderRadius="full"
/>
```

### Pattern 4: Stats Display

**Web Pattern:**
- Icon + label + value
- Color-coded by type (gold, cyan, orange)
- Inline layout
- Gradient backgrounds

**Mobile Implementation:**
```typescript
// Use existing StatCard with farm colors
<StatCard
  icon="💰"
  label="Money"
  value={money}
  variant="gold"  // Maps to highlightYellow
/>
```

---

## Icon & Emoji Strategy

**Web Approach:** Pure emoji text (🍅 🥕 🌽 🍉 💎 💰)

**Mobile Approach:** Same, but with considerations:

**Challenges:**
- Emoji rendering differs per platform (iOS vs Android)
- Some emoji may not render in older OS versions
- Sizing can be inconsistent

**Solution:**
```typescript
// src/components/atoms/Emoji.tsx
type EmojiProps = {
  symbol: string;
  size?: number;
};

export const Emoji = ({ symbol, size = 24 }: EmojiProps) => (
  <Text
    fontSize={size}
    lineHeight={size}
    style={{ includeFontPadding: false }}  // Android fix
  >
    {symbol}
  </Text>
);

// Usage
<Emoji symbol="🍅" size={40} />
```

**Fallback Plan:** If emoji issues arise, use SVG icons with similar style

---

## Animation Patterns

### Web Animations (CSS)
1. **Sway** - Crops gently rotate (-5° to +5°)
2. **Bounce** - Buttons scale on click
3. **Fade** - Modals fade in/out
4. **Slide** - Tabs slide horizontally

### Mobile Animations (Reanimated 3)

```typescript
// src/animations/farmAnimations.ts
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

// Sway animation
export const useSwayAnimation = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(5, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

// Usage
const swayStyle = useSwayAnimation();
<Animated.View style={swayStyle}>
  <Emoji symbol="🍅" size={40} />
</Animated.View>
```

---

## Implementation Checklist

### Phase 1: Theme Extension
- [ ] Add farm colors to [src/theme/restyle.ts](../src/theme/restyle.ts)
- [ ] Add feature colors (focus, break, storage)
- [ ] Add crop colors
- [ ] Create font config with pixel font strategy
- [ ] Add text variants (pixelHeader, pixelBody, farmLabel)
- [ ] Add shadow definitions
- [ ] Test theme with existing components (no breaks)

### Phase 2: Component Variants
- [ ] Extend Card with farm variants (farmPlot, farmModal, farmButton)
- [ ] Extend Button with farm variant
- [ ] Update ProgressBar for farm colors
- [ ] Verify StatCard works with new colors

### Phase 3: New Atoms
- [ ] Create Emoji component with platform fixes
- [ ] Create CircularProgress component (SVG)
- [ ] Add animation hooks (useSway, useBounce, useFade)

### Phase 4: Documentation
- [ ] Update [COMPONENTS_GUIDE.md](../COMPONENTS_GUIDE.md) with farm variants
- [ ] Document color usage guidelines
- [ ] Create Storybook stories for farm components
- [ ] Add design token reference doc

---

## Testing Strategy

### Visual Regression Tests
```typescript
// __tests__/theme.test.tsx
describe('Farm Theme', () => {
  it('renders farm colors correctly', () => {
    const { getByTestId } = render(
      <Box backgroundColor="farmBoard" testID="farm-box" />
    );
    const box = getByTestId('farm-box');
    expect(box.props.style.backgroundColor).toBe('#4caf50');
  });

  it('applies farm card variant', () => {
    const { getByTestId } = render(
      <Card variant="farmPlot" testID="plot-card" />
    );
    const card = getByTestId('plot-card');
    expect(card.props.style.borderWidth).toBe(4);
    expect(card.props.style.borderColor).toBe('#5d4037');
  });
});
```

### Manual Testing Checklist
- [ ] Farm colors render correctly on iOS
- [ ] Farm colors render correctly on Android
- [ ] Emoji display consistently across platforms
- [ ] Animations run at 60fps
- [ ] Dark mode non-farm screens still work
- [ ] Theme switching works (if implemented)

---

## Migration from Web CSS

### CSS → Restyle Mapping Examples

**Example 1: Plot Card**
```css
/* Web CSS */
.plot {
  background: #4caf50;
  border: 4px solid #5d4037;
  border-radius: 16px;
  padding: 8px;
  aspect-ratio: 1;
}
```
```typescript
// Mobile Restyle
<Card
  variant="farmPlot"
  aspectRatio={1}
/>
```

**Example 2: Modal**
```css
/* Web CSS */
.modal {
  background: #8d6e63;
  border: 8px solid #3e2723;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 20px 25px rgba(0,0,0,0.1);
}
```
```typescript
// Mobile Restyle
<Box
  backgroundColor="farmCardBg"
  borderWidth={8}
  borderColor="farmBorderDark"
  borderRadius="xxl"
  padding="l"
  style={shadows.xl}
/>
```

**Example 3: Stat Display**
```css
/* Web CSS */
.stat {
  background: linear-gradient(135deg, #ffd700, #ffb300);
  padding: 12px 24px;
  border-radius: 20px;
  color: #1a1a1a;
  font-weight: 600;
}
```
```typescript
// Mobile Restyle (gradient via LinearGradient)
<LinearGradient
  colors={['#ffd700', '#ffb300']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ borderRadius: 20, padding: 12 }}
>
  <Text variant="farmLabel" color="textDark">{value}</Text>
</LinearGradient>
```

---

## Design System Documentation

Create design token reference:

```markdown
# Farm Design Tokens

## Colors

### Primary Farm Colors
- `farmBoard` (#4caf50) - Main farm grid background
- `farmBorder` (#5d4037) - Border for cards/plots
- `farmBorderDark` (#3e2723) - Darker borders for emphasis

### Gradients
- Farm Background: `farmGradientStart` → `farmGradientEnd`
- Money Stat: `gold` → `highlightYellow`

### Feature Colors
- Pomodoro Focus: `focusRed` (#ef5350)
- Pomodoro Break: `breakGreen` (#66bb6a)
- Storage Modal: `storageCyan` (#56ccf2)

### Crop Colors
- Tomato: `cropTomato` (#ff6347)
- Carrot: `cropCarrot` (#ff8c00)
- Corn: `cropCorn` (#ffeb3b)
- Watermelon: `cropWatermelon` (#e91e63)

## Typography

### Font Families
- Pixel: System monospace with bold weight
- Body: System default

### Text Variants
- `pixelHeader` - Large pixel-style headers
- `pixelBody` - Small pixel-style labels
- `farmLabel` - Standard farm UI labels

## Usage Guidelines

### Do's ✅
- Use farm colors only in farm-related screens
- Keep dark mode colors for other screens
- Use emoji for consistency with web
- Apply thick borders (4-8px) for farm aesthetic

### Don'ts ❌
- Don't mix farm colors with dark mode colors
- Don't use thin borders (<2px) on farm components
- Don't use standard Material icons (use emoji)
- Don't apply farm theme to entire app
```

---

## Next Steps

1. ✅ Read this plan thoroughly
2. ⬜ Check Press Start 2P font license
3. ⬜ Update [src/theme/restyle.ts](../src/theme/restyle.ts) with farm colors
4. ⬜ Create font config
5. ⬜ Extend Card/Button components with farm variants
6. ⬜ Create Emoji atom component
7. ⬜ Test theme changes don't break existing screens
8. ⬜ Proceed to Plan 03: Component Architecture

---

## References

- Web styles: [src/web/App.tsx](../src/web/App.tsx)
- Current theme: [src/theme/restyle.ts](../src/theme/restyle.ts)
- Restyle docs: https://github.com/Shopify/restyle
- Reanimated docs: https://docs.swmansion.com/react-native-reanimated/
