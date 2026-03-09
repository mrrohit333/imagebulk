import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────
// Colors — neon dark palette (matches the web frontend design)
// ─────────────────────────────────────────────────────────────
export const Colors = {
    // Neon accents
    neonGreen: '#00ff88',
    neonCyan: '#00d4ff',
    neonPink: '#ff006e',
    neonPurple: '#7c3aed',

    // Dark backgrounds
    darkBg: '#050505',
    darkCard: '#0d0d0d',
    darkCardBorder: '#1a1a2e',
    darkSurface: '#111827',

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#4b5563',

    // Semantic
    success: '#00ff88',
    error: '#ff4757',
    warning: '#ffa502',
    info: '#00d4ff',

    // Transparent overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    glassCard: 'rgba(255, 255, 255, 0.05)',
    glassCardBorder: 'rgba(255, 255, 255, 0.1)',
};

// ─────────────────────────────────────────────────────────────
// Typography
// ─────────────────────────────────────────────────────────────
export const Typography = {
    fontSizeXS: 11,
    fontSizeSM: 13,
    fontSizeMD: 15,
    fontSizeLG: 17,
    fontSizeXL: 20,
    fontSize2XL: 24,
    fontSize3XL: 30,
    fontSize4XL: 36,

    fontWeightNormal: '400' as const,
    fontWeightMedium: '500' as const,
    fontWeightSemiBold: '600' as const,
    fontWeightBold: '700' as const,
    fontWeightBlack: '900' as const,
};

// ─────────────────────────────────────────────────────────────
// Spacing Scale (4px base)
// ─────────────────────────────────────────────────────────────
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
};

// ─────────────────────────────────────────────────────────────
// Border radius
// ─────────────────────────────────────────────────────────────
export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 999,
};

// ─────────────────────────────────────────────────────────────
// Shared base styles
// ─────────────────────────────────────────────────────────────
export const BaseStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.darkBg,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textPrimary: {
        color: Colors.textPrimary,
        fontWeight: Typography.fontWeightMedium,
    },
    textSecondary: {
        color: Colors.textSecondary,
    },
});
