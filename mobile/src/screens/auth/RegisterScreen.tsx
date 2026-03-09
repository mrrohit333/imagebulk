import React, { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AuthService } from '../../services/authService';
import { useApp } from '../../context/AppContext';
import { Colors, Spacing, Typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const { showToast } = useApp();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string; email?: string; password?: string; confirmPassword?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!name.trim()) { newErrors.name = 'Name is required'; }
        if (!email.trim()) { newErrors.email = 'Email is required'; }
        else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Invalid email'; }
        if (!password) { newErrors.password = 'Password is required'; }
        else if (password.length < 6) { newErrors.password = 'Minimum 6 characters'; }
        if (password !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) { return; }
        setLoading(true);
        try {
            await AuthService.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });
            showToast('success', 'OTP Sent!', `Check ${email} for your verification code`);
            navigation.navigate('OTP', { email: email.trim().toLowerCase() });
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Registration failed. Try again.';
            showToast('error', 'Registration Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none">

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>⚡ ImageBulk</Text>
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subtitle}>Get 20 free credits on signup 🎉</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    autoCapitalize="words"
                    returnKeyType="next"
                    value={name}
                    onChangeText={setName}
                    error={errors.name}
                />
                <Input
                    label="Email"
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    value={email}
                    onChangeText={setEmail}
                    error={errors.email}
                />
                <Input
                    label="Password"
                    placeholder="Min. 6 characters"
                    isPassword
                    returnKeyType="next"
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                />
                <Input
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    isPassword
                    returnKeyType="done"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={errors.confirmPassword}
                    onSubmitEditing={handleRegister}
                />

                <Button title="Create Account" onPress={handleRegister} loading={loading} />

                {/* Legal notice */}
                <View style={styles.legalNotice}>
                    <Text style={styles.legalText}>By creating an account, you agree to our </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://imagebulk-downloader.vercel.app/terms-of-service')}>
                        <Text style={styles.legalLink}>Terms of Service</Text>
                    </TouchableOpacity>
                    <Text style={styles.legalText}> and </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://imagebulk-downloader.vercel.app/privacy-policy')}>
                        <Text style={styles.legalLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <Text style={styles.legalText}>.</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Sign in</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: Spacing.sm,
    },
    subtitle: { fontSize: Typography.fontSizeMD, color: Colors.neonCyan },
    form: { marginBottom: Spacing.lg },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { color: Colors.textSecondary, fontSize: Typography.fontSizeMD },
    link: {
        color: Colors.neonGreen,
        fontSize: Typography.fontSizeMD,
        fontWeight: Typography.fontWeightBold,
    },
    legalNotice: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    legalText: { color: Colors.textMuted, fontSize: Typography.fontSizeXS },
    legalLink: {
        color: Colors.neonCyan,
        fontSize: Typography.fontSizeXS,
        textDecorationLine: 'underline',
    },
});
