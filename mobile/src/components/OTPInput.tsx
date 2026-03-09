import React, { useEffect, useRef } from 'react';
import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    View,
    ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (otp: string) => void;
    error?: string;
    containerStyle?: ViewStyle;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    length = 6,
    value,
    onChange,
    error,
    containerStyle,
}) => {
    const inputs = useRef<(TextInput | null)[]>([]);
    const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

    const handleChange = (text: string, index: number) => {
        // Only accept numeric input
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        onChange(newDigits.join(''));

        // Auto-advance
        if (digit && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number,
    ) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    // Auto-focus first input on mount
    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    return (
        <View style={containerStyle}>
            <View style={styles.row}>
                {digits.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={el => {
                            inputs.current[index] = el;
                        }}
                        style={[
                            styles.cell,
                            digit ? styles.cellFilled : null,
                            !!error && styles.cellError,
                        ]}
                        value={digit}
                        onChangeText={text => handleChange(text, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectionColor={Colors.neonGreen}
                        textContentType="oneTimeCode"
                    />
                ))}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    cell: {
        width: 48,
        height: 56,
        backgroundColor: Colors.darkCard,
        borderWidth: 1.5,
        borderColor: Colors.darkCardBorder,
        borderRadius: Radius.md,
        textAlign: 'center',
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBold,
        color: Colors.neonGreen,
    },
    cellFilled: {
        borderColor: Colors.neonGreen,
        shadowColor: Colors.neonGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    cellError: {
        borderColor: Colors.error,
    },
    error: {
        color: Colors.error,
        fontSize: Typography.fontSizeXS,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
});
