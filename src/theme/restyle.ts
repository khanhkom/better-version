import { createTheme } from '@shopify/restyle';

const palette = {
  // Dark background colors
  cardBg: '#1A1C24',
  cardBgLight: '#252832',
  darkBg: '#0A0B0F',

  // Accent colors
  danger: '#EF4444',
  primary: '#5CE1E6',
  secondary: '#FFD700',
  success: '#4ADE80',
  warning: '#F59E0B',

  // Text colors (alphabetical order, but from lightest to darkest in usage)
  textDark: '#374151', // Darkest for subtle hints
  textDim: '#4B5563', // Very dim for placeholder text
  textLight: '#E5E7EB', // Light gray for less important text
  textMuted: '#6B7280', // Muted gray for disabled/tertiary text
  textPrimary: '#FFFFFF', // Brightest white for main text
  textSecondary: '#A1A3A8', // Medium gray for secondary text

  // Border colors
  borderDefault: '#2A2D36',
  borderPrimary: '#FFD700',
  borderSecondary: '#5CE1E6',

  // Icon background colors
  iconBgBlue: '#1A2A3D',
  iconBgGold: '#3D3419',
  iconBgGreen: '#1A3D2A',
  iconBgOrange: '#3D2419',

  // Progress bar colors
  black: '#000000',
  progressBgPink: '#3D1928',
  progressBgYellow: '#3D3419',
  progressPink: '#FF1B7C',
  progressYellow: '#FFD700',
  transparent: 'transparent',
  white: '#FFFFFF',

  // Farm theme colors
  farmBoard: '#4caf50',
  farmBorder: '#5d4037',
  farmBorderDark: '#3e2723',
  farmCardBg: '#8d6e63',
  farmCardBgLight: '#d7ccc8',
  farmGradientEnd: '#3a7332',
  farmGradientStart: '#2d5a27',

  // Feature-specific colors
  breakGreen: '#66bb6a',
  focusRed: '#ef5350',
  gold: '#ffd700',
  highlightOrange: '#ff9800',
  highlightYellow: '#ffb300',
  storageCyan: '#56ccf2',

  // Crop colors
  cropCarrot: '#ff8c00',
  cropCorn: '#ffeb3b',
  cropTomato: '#ff6347',
  cropWatermelon: '#e91e63',
};

const theme = createTheme({
  borderRadii: {
    full: 9999,
    l: 16,
    m: 12,
    s: 8,
    xl: 20,
    xs: 4,
    xxl: 24,
  },
  buttonVariants: {
    defaults: {
      alignItems: 'center',
      backgroundColor: 'primary',
      borderRadius: 'full',
      justifyContent: 'center',
      paddingHorizontal: 'xl',
      paddingVertical: 'm',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: 'borderPrimary',
      borderRadius: 'full',
      borderWidth: 2,
      paddingHorizontal: 'xl',
      paddingVertical: 'm',
    },
    primary: {
      backgroundColor: 'success',
      borderRadius: 'full',
      paddingHorizontal: 'xxxl',
      paddingVertical: 'l',
    },
    secondary: {
      backgroundColor: 'cardBgLight',
      borderRadius: 'full',
      paddingHorizontal: 'xl',
      paddingVertical: 'm',
    },
  },
  cardVariants: {
    bordered: {
      backgroundColor: 'cardPrimaryBackground',
      borderColor: 'borderDefault',
      borderRadius: 'l',
      borderWidth: 1,
      padding: 'l',
    },
    defaults: {
      backgroundColor: 'cardPrimaryBackground',
      borderRadius: 'l',
      padding: 'l',
    },
    elevated: {
      backgroundColor: 'cardPrimaryBackground',
      borderRadius: 'l',
      elevation: 8,
      padding: 'l',
      shadowColor: 'black',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    stat: {
      alignItems: 'center',
      backgroundColor: 'cardPrimaryBackground',
      borderColor: 'borderPrimary',
      borderRadius: 'l',
      borderWidth: 2,
      padding: 'l',
    },
    // Farm variants
    farmButton: {
      backgroundColor: 'farmCardBgLight',
      borderColor: 'farmBorder',
      borderRadius: 'xl',
      borderWidth: 2,
      padding: 'm',
    },
    farmModal: {
      backgroundColor: 'farmCardBg',
      borderColor: 'farmBorderDark',
      borderRadius: 'xxl',
      borderWidth: 8,
      padding: 'l',
    },
    farmPlot: {
      aspectRatio: 1,
      backgroundColor: 'farmBoard',
      borderColor: 'farmBorder',
      borderRadius: 'l',
      borderWidth: 4,
      padding: 's',
    },
  },
  colors: {
    ...palette,
    cardPrimaryBackground: palette.cardBg,
    cardSecondaryBackground: palette.cardBgLight,
    mainBackground: palette.darkBg,
  },
  spacing: {
    l: 16,
    m: 12,
    s: 8,
    xl: 20,
    xs: 4,
    xxl: 24,
    xxs: 2,
    xxxl: 32,
  },
  textVariants: {
    body: {
      color: 'textPrimary',
      fontSize: 14,
      fontWeight: '400',
    },
    bodySecondary: {
      color: 'textSecondary',
      fontSize: 14,
      fontWeight: '400',
    },
    caption: {
      color: 'textSecondary',
      fontSize: 12,
      fontWeight: '400',
    },
    defaults: {
      color: 'textPrimary',
      fontSize: 14,
      fontWeight: '400',
    },
    header: {
      color: 'textPrimary',
      fontSize: 18,
      fontWeight: '700',
    },
    label: {
      color: 'textPrimary',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    stat: {
      color: 'textPrimary',
      fontSize: 24,
      fontWeight: '700',
    },
    title: {
      color: 'textPrimary',
      fontSize: 16,
      fontWeight: '600',
    },
    // Farm variants
    farmLabel: {
      color: 'farmCardBgLight',
      fontSize: 14,
      fontWeight: '600',
    },
    pixelBody: {
      color: 'textPrimary',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
    },
    pixelHeader: {
      color: 'textPrimary',
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  },
});

export type Theme = typeof theme;
export default theme;
