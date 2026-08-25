import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#4E33D9', // CUI Brand Purple
    primaryLight: '#F0EEFD', // Light tint of CUI Purple
    secondaryBrand: '#181236',
    background: '#F8F9FD', // Off-white cool canvas
    card: '#FFFFFF',
    text: '#181829', // Primary text - Dark Charcoal
    textSecondary: '#334155', // Secondary text - Slate-700
    textTertiary: '#9BA3AF', // Muted/Placeholder
    border: '#E8ECF4',
    
    // Status
    success: '#00B074',
    successLight: '#E6F7F0',
    successDark: '#008254',
    
    warning: '#FF8A00',
    warningLight: '#FFF5EC',
    warningDark: '#C46200',
    
    danger: '#FF3B30',
    dangerLight: '#FFEBEB',
    dangerDark: '#D32F2F',
    
    info: '#3B82F6',
    infoLight: '#EFF6FF',
    infoDark: '#1D4ED8',
    
    // Accents
    accentPurple: '#7F3DFF',
    accentPurpleLight: '#F3E8FF',
    accentTeal: '#00BAC7',
    accentTealLight: '#E0F7F9',
    accentGold: '#FFD02C',
    accentGoldLight: '#FFFBE6',
    accentPink: '#FF4A8B',
    accentPinkLight: '#FFEBF2',
  },
  dark: {
    primary: '#4E33D9',
    primaryLight: '#2C2459',
    secondaryBrand: '#0F0A21',
    background: '#0F0A21',
    card: '#181236',
    text: '#FFFFFF',
    textSecondary: '#9BA3AF',
    textTertiary: '#687182',
    border: '#2C2459',
    
    // Status
    success: '#00B074',
    successLight: '#163E30',
    successDark: '#008254',
    
    warning: '#FF8A00',
    warningLight: '#3F2C10',
    warningDark: '#C46200',
    
    danger: '#FF3B30',
    dangerLight: '#3F1816',
    dangerDark: '#D32F2F',
    
    info: '#3B82F6',
    infoLight: '#16284F',
    infoDark: '#1D4ED8',
    
    accentPurple: '#7F3DFF',
    accentPurpleLight: '#2A104E',
    accentTeal: '#00BAC7',
    accentTealLight: '#103F42',
    accentGold: '#FFD02C',
    accentGoldLight: '#3F3510',
    accentPink: '#FF4A8B',
    accentPinkLight: '#3F1A28',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  title: 'PPEditorialNew-Regular',
  titleItalic: 'PPEditorialNew-Italic',
  titleBold: 'PPEditorialNew-Ultrabold',
  body: 'Inter-Regular',
  bodyBold: 'Inter-Bold',
  bodyMedium: 'Inter-Medium',
  sans: 'Inter-Regular',
  serif: 'PPEditorialNew-Regular',
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
