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
import { Input } from '../../components/Input';
import { AuthService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Colors, Spacing, Typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const { login } = useAuth();
    const { showToast } = useApp();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!email.trim()) { newErrors.email = 'Email is required'; }
        else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Invalid email format'; }
        if (!password) { newErrors.password = 'Password is required'; }
        else if (password.length < 6) { newErrors.password = 'Minimum 6 characters'; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) { return; }
        setLoading(true);
        try {
            const { token, user } = await AuthService.login({
                email: email.trim().toLowerCase(),
                password,
            });
            await login(token, user);
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Login failed. Please try again.';
            showToast('error', 'Login Failed', message);
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
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
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
                    placeholder="Your password"
                    isPassword
                    returnKeyType="done"
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                    onSubmitEditing={handleLogin}
                />

                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.loginBtn}
                />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Create one</Text>
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
        letterSpacing: -0.5,
    },
    title: {
        fontSize: Typography.fontSize3XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: Typography.fontSizeMD,
        color: Colors.textSecondary,
    },
    form: { marginBottom: Spacing.xxl },
    loginBtn: { marginTop: Spacing.sm },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: { color: Colors.textSecondary, fontSize: Typography.fontSizeMD },
    link: {
        color: Colors.neonGreen,
        fontSize: Typography.fontSizeMD,
        fontWeight: Typography.fontWeightBold,
    },
});
