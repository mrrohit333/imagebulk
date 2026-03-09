import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const LEGAL_LINKS = {
    privacy: 'https://imagebulk-downloader.vercel.app/privacy-policy',
    terms: 'https://imagebulk-downloader.vercel.app/terms-of-service',
};
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/authService';
import { Config } from '../../config/env';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import Toast from 'react-native-toast-message';

export const ProfileScreen: React.FC = () => {
    const { user, logout, refreshUser, deleteAccount } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Refresh user data on mount to populate createdAt and isVerified
    useEffect(() => { refreshUser(); }, [refreshUser]);

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    setLoggingOut(true);
                    await logout();
                },
            },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone and you will lose all past downloads and credits.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Permanently',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoggingOut(true);
                            await deleteAccount();
                            Toast.show({ type: 'success', text1: 'Account deleted' });
                        } catch (error) {
                            Toast.show({ type: 'error', text1: 'Failed to delete account' });
                            setLoggingOut(false);
                        }
                    },
                },
            ],
        );
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            await AuthService.updateProfile({
                name: editName,
            });
            await refreshUser();
            setIsEditing(false);
            Toast.show({ type: 'success', text1: 'Profile updated' });
        } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEdit = () => {
        if (!isEditing) {
            setEditName(user?.name || user?.email?.split('@')[0] || '');
        }
        setIsEditing(!isEditing);
    };

    // User model has no name field — use email prefix as display name
    const displayName = user?.name ?? user?.email?.split('@')[0] ?? '—';
    const avatarLetter = displayName[0]?.toUpperCase() ?? '?';

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
        })
        : '—';

    const currentProfileImage = user?.profileImage ? `${Config.API_BASE_URL}${user.profileImage}` : null;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            {/* Avatar + Name */}
            <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                    {currentProfileImage ? (
                        <Image source={{ uri: currentProfileImage }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarText}>{avatarLetter}</Text>
                        </View>
                    )}
                </View>

                {isEditing ? (
                    <View style={styles.editNameContainer}>
                        <Input
                            placeholder="Enter your name"
                            value={editName}
                            onChangeText={setEditName}
                            containerStyle={styles.nameInputContainer}
                            style={styles.nameInput}
                        />
                    </View>
                ) : (
                    <Text style={styles.name}>{displayName}</Text>
                )}

                <Text style={styles.email}>{user?.email ?? '—'}</Text>
                <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>
                        {user?.isVerified ? '✅ Verified' : '⚠️ Unverified'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.editProfileBtn} onPress={isEditing ? undefined : toggleEdit}>
                    {isEditing ? (
                        <View style={styles.editActionRow}>
                            <Button title="Cancel" variant="outline" onPress={toggleEdit} style={styles.cancelBtn} disabled={isSaving} />
                            <Button title="Save" variant="primary" onPress={handleSaveProfile} loading={isSaving} style={styles.saveBtn} />
                        </View>
                    ) : (
                        <Text style={styles.editProfileText}>Edit Name</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Credits card */}
            <Card variant="neon" style={styles.creditCard}>
                <Text style={styles.creditTitle}>⚡ Your Credits</Text>
                <Text style={styles.creditAmount}>{user?.credits ?? 0}</Text>
                <Text style={styles.creditSub}>1 credit = 1 image download</Text>
            </Card>

            {/* Account info */}
            <Card style={styles.infoCard}>
                <InfoRow label="Member Since" value={memberSince} />
                <InfoRow label="Account Status" value={user?.isVerified ? 'Active' : 'Pending Verification'} />
                <InfoRow label="Total Credits" value={`${user?.credits ?? 0} remaining`} />
            </Card>

            {/* Legal */}
            <Card style={styles.legalCard}>
                <Text style={styles.legalTitle}>Legal</Text>
                <TouchableOpacity
                    style={styles.legalRow}
                    onPress={() => Linking.openURL(LEGAL_LINKS.privacy)}>
                    <Text style={styles.legalIcon}>🔒</Text>
                    <Text style={styles.legalText}>Privacy Policy</Text>
                    <Text style={styles.legalArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.legalRow, styles.legalRowLast]}
                    onPress={() => Linking.openURL(LEGAL_LINKS.terms)}>
                    <Text style={styles.legalIcon}>📄</Text>
                    <Text style={styles.legalText}>Terms of Service</Text>
                    <Text style={styles.legalArrow}>›</Text>
                </TouchableOpacity>
            </Card>

            {/* Actions */}
            <Button
                title="Sign Out"
                variant="outline"
                onPress={handleLogout}
                disabled={loggingOut}
                style={styles.logoutBtn}
            />

            <Button
                title="Delete Account"
                variant="danger"
                onPress={handleDeleteAccount}
                loading={loggingOut}
                style={styles.deleteBtn}
            />

            <Text style={styles.version}>ImageBulk Mobile v1.0.0</Text>
        </ScrollView>
    );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={infoStyles.row}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
    </View>
);

const infoStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkCardBorder,
    },
    label: { color: Colors.textSecondary, fontSize: Typography.fontSizeSM },
    value: { color: Colors.textPrimary, fontWeight: Typography.fontWeightMedium, fontSize: Typography.fontSizeSM },
});

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Colors.darkBg },
    content: { padding: Spacing.xl, paddingTop: Spacing.xxl },
    avatarSection: { alignItems: 'center', marginBottom: Spacing.xxl },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: Spacing.md,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Colors.neonGreen,
        shadowColor: Colors.neonGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarFallback: {
        flex: 1,
        backgroundColor: Colors.neonGreen + '22',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.neonGreen,
    },
    editNameContainer: {
        width: '80%',
        marginBottom: Spacing.sm,
    },
    nameInputContainer: {
        marginVertical: 0,
    },
    nameInput: {
        textAlign: 'center',
        fontSize: Typography.fontSizeXL,
        fontWeight: Typography.fontWeightBold,
        paddingVertical: Spacing.sm,
    },
    name: {
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    email: { color: Colors.textSecondary, fontSize: Typography.fontSizeMD, marginBottom: Spacing.md },
    verifiedBadge: {
        backgroundColor: Colors.neonGreen + '22',
        borderRadius: Radius.round,
        paddingVertical: 4,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.neonGreen + '55',
        marginBottom: Spacing.lg,
    },
    verifiedText: { color: Colors.neonGreen, fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightBold },
    editProfileBtn: {
        marginTop: Spacing.xs,
    },
    editProfileText: {
        color: Colors.neonGreen,
        fontSize: Typography.fontSizeSM,
        fontWeight: Typography.fontWeightBold,
    },
    editActionRow: {
        flexDirection: 'row',
        width: '100%',
        gap: Spacing.md,
        justifyContent: 'center',
    },
    cancelBtn: { flex: 1 },
    saveBtn: { flex: 1 },
    creditCard: { alignItems: 'center', marginBottom: Spacing.xl },
    creditTitle: { color: Colors.textSecondary, fontSize: Typography.fontSizeSM, marginBottom: Spacing.sm },
    creditAmount: {
        fontSize: 56,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.neonGreen,
        lineHeight: 64,
    },
    creditSub: { color: Colors.textMuted, fontSize: Typography.fontSizeXS, marginTop: 4 },
    infoCard: { marginBottom: Spacing.xl },
    legalCard: { marginBottom: Spacing.xl, paddingVertical: 0 },
    legalTitle: {
        color: Colors.textSecondary,
        fontSize: Typography.fontSizeXS,
        fontWeight: Typography.fontWeightMedium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkCardBorder,
    },
    legalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkCardBorder,
    },
    legalRowLast: { borderBottomWidth: 0 },
    legalIcon: { fontSize: 16, marginRight: Spacing.md },
    legalText: { flex: 1, color: Colors.textPrimary, fontSize: Typography.fontSizeSM },
    legalArrow: { color: Colors.textMuted, fontSize: 20 },
    logoutBtn: { marginBottom: Spacing.md },
    deleteBtn: { marginBottom: Spacing.xl },
    version: { textAlign: 'center', color: Colors.textMuted, fontSize: Typography.fontSizeXS, marginBottom: Spacing.xxl },
});
