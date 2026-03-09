import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Button } from '../../components/Button';
import { OTPInput } from '../../components/OTPInput';
import { AuthService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Colors, Spacing, Typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

export const OTPScreen: React.FC<Props> = ({ route, navigation }) => {
    const { email } = route.params;
    const { login } = useAuth();
    const { showToast } = useApp();

    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length < 6) {
            setOtpError('Please enter all 6 digits');
            return;
        }
        setOtpError('');
        setLoading(true);
        try {
            const { token, user } = await AuthService.verifyEmail({ email, otp });
            await login(token, user);
            showToast('success', 'Email Verified!', `Welcome to ImageBulk, ${user.name}!`);
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Invalid OTP. Try again.';
            setOtpError(message);
            showToast('error', 'Verification Failed', message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            await AuthService.resendOTP({ email });
            showToast('success', 'OTP Resent!', 'Check your inbox for a new code');
            setOtp('');
            setOtpError('');
        } catch (err: any) {
            showToast('error', 'Resend Failed', 'Could not resend OTP. Try again later.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>⚡ ImageBulk</Text>
                <Text style={styles.title}>Verify your email</Text>
                <Text style={styles.subtitle}>
                    We sent a 6-digit code to{'\n'}
                    <Text style={styles.emailHighlight}>{email}</Text>
                </Text>
            </View>

            {/* OTP Input */}
            <OTPInput
                value={otp}
                onChange={setOtp}
                error={otpError}
                containerStyle={styles.otpContainer}
            />

            {/* Verify Button */}
            <Button
                title="Verify Email"
                onPress={handleVerify}
                loading={loading}
                style={styles.verifyBtn}
                disabled={otp.length < 6}
            />

            {/* Resend + Back */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Didn't receive the code? </Text>
                <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                    <Text style={styles.link}>{resendLoading ? 'Sending...' : 'Resend'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Colors.darkBg },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.huge,
    },
    header: { alignItems: 'center', marginBottom: Spacing.xxxl },
    logo: {
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.neonGreen,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.fontSize3XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
        marginBottom: Spacing.lg,
    },
    subtitle: {
        fontSize: Typography.fontSizeMD,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    emailHighlight: {
        color: Colors.neonCyan,
        fontWeight: Typography.fontWeightBold,
    },
    otpContainer: { marginBottom: Spacing.xxl },
    verifyBtn: { marginBottom: Spacing.xxl },
    footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xl },
    footerText: { color: Colors.textSecondary, fontSize: Typography.fontSizeMD },
    link: {
        color: Colors.neonGreen,
        fontSize: Typography.fontSizeMD,
        fontWeight: Typography.fontWeightBold,
    },
    backBtn: { alignItems: 'center' },
    backText: { color: Colors.textMuted, fontSize: Typography.fontSizeSM },
});
