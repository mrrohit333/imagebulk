import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'neon' | 'flat';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'default',
}) => {
    return (
        <View style={[styles.card, styles[variant], style]}>{children}</View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Radius.lg,
        padding: Spacing.xl,
    },
    default: {
        backgroundColor: Colors.darkCard,
        borderWidth: 1,
        borderColor: Colors.glassCardBorder,
    },
    neon: {
        backgroundColor: Colors.glassCard,
        borderWidth: 1,
        borderColor: Colors.neonGreen + '33',
        shadowColor: Colors.neonGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
    },
    flat: {
        backgroundColor: Colors.darkSurface,
    },
});
