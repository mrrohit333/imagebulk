import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = true,
    disabled,
    style,
    ...props
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={isDisabled}
            style={[
                styles.base,
                styles[variant],
                styles[`size_${size}`],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            {...props}>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? Colors.neonGreen : Colors.darkBg}
                    size="small"
                />
            ) : (
                <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radius.md,
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    // Variants
    primary: {
        backgroundColor: Colors.neonGreen,
        shadowColor: Colors.neonGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    secondary: {
        backgroundColor: Colors.neonCyan,
        shadowColor: Colors.neonCyan,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.neonGreen,
    },
    ghost: {
        backgroundColor: Colors.glassCard,
        borderWidth: 1,
        borderColor: Colors.glassCardBorder,
    },
    danger: {
        backgroundColor: Colors.error,
    },
    disabled: {
        opacity: 0.45,
    },
    // Sizes
    size_sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
    size_md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
    size_lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl },
    // Labels
    label: {
        fontWeight: Typography.fontWeightBold,
    },
    label_primary: { color: Colors.darkBg },
    label_secondary: { color: Colors.darkBg },
    label_outline: { color: Colors.neonGreen },
    label_ghost: { color: Colors.textPrimary },
    label_danger: { color: Colors.textPrimary },
    // Label sizes
    labelSize_sm: { fontSize: Typography.fontSizeSM },
    labelSize_md: { fontSize: Typography.fontSizeMD },
    labelSize_lg: { fontSize: Typography.fontSizeLG },
});
