import React, { forwardRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
    ({ label, error, hint, rightIcon, containerStyle, isPassword, style, ...props }, ref) => {
        // NOTE: Do NOT useState for focus tracking — it causes re-renders which
        // trigger onBlur/onFocus loop on Android creating a focus-switch bug.
        const [showPassword, setShowPassword] = useState(false);

        return (
            <View style={[styles.container, containerStyle]}>
                {label ? <Text style={styles.label}>{label}</Text> : null}

                <View
                    style={[
                        styles.inputWrapper,
                        !!error && styles.inputWrapperError,
                    ]}>
                    <TextInput
                        ref={ref}
                        style={[styles.input, style]}
                        placeholderTextColor={Colors.textMuted}
                        secureTextEntry={isPassword && !showPassword}
                        selectionColor={Colors.neonGreen}
                        underlineColorAndroid="transparent"
                        {...props}
                    />

                    {isPassword ? (
                        <TouchableOpacity
                            onPress={() => setShowPassword(v => !v)}
                            style={styles.iconBtn}>
                            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                    ) : rightIcon ? (
                        <View style={styles.iconBtn}>{rightIcon}</View>
                    ) : null}
                </View>

                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : hint ? (
                    <Text style={styles.hint}>{hint}</Text>
                ) : null}
            </View>
        );
    },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: Typography.fontSizeSM,
        fontWeight: Typography.fontWeightMedium,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.darkCard,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.neonGreen,   // always neon border — no state needed
        paddingHorizontal: Spacing.lg,
    },
    inputWrapperError: {
        borderColor: Colors.error,
    },
    input: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: Typography.fontSizeMD,
        paddingVertical: Spacing.md,
        fontWeight: Typography.fontWeightNormal,
    },
    iconBtn: {
        padding: Spacing.xs,
    },
    eyeIcon: {
        fontSize: 16,
    },
    error: {
        color: Colors.error,
        fontSize: Typography.fontSizeXS,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    hint: {
        color: Colors.textMuted,
        fontSize: Typography.fontSizeXS,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
