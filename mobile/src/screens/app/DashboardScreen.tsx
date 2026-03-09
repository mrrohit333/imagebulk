import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { DownloadService } from '../../services/downloadService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { Config } from '../../config/env';

const COUNT_OPTIONS = [10, 20, 30, 50, 75, 100];

export const DashboardScreen: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const { showToast } = useApp();

    const [keyword, setKeyword] = useState('');
    const [selectedCount, setSelectedCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const creditsNeeded = selectedCount;
    const hasEnoughCredits = (user?.credits ?? 0) >= creditsNeeded;

    const handleDownload = async () => {
        if (!keyword.trim()) {
            showToast('error', 'Keyword Required', 'Enter a keyword to search images');
            return;
        }
        if (!hasEnoughCredits) {
            showToast('error', 'Insufficient Credits', 'Go to Pricing to buy more credits');
            return;
        }

        setLoading(true);
        setDownloadUrl(null);
        try {
            const result = await DownloadService.downloadImages({
                keyword: keyword.trim(),
                count: selectedCount,
            });

            // Resolve full URL
            const fullUrl = result.downloadUrl.startsWith('http')
                ? result.downloadUrl
                : `${Config.API_BASE_URL}${result.downloadUrl}`;

            setDownloadUrl(fullUrl);
            await refreshUser();
            showToast(
                'success',
                'Download Ready!',
                `${result.imagesDownloaded} images • ${result.creditsUsed} credits used`,
            );
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Download failed. Try again.';
            showToast('error', 'Download Failed', message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenZip = async () => {
        if (!downloadUrl) { return; }
        const supported = await Linking.canOpenURL(downloadUrl);
        if (supported) {
            await Linking.openURL(downloadUrl);
        } else {
            Alert.alert('Error', 'Cannot open the download URL in your browser');
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
                    <Text style={styles.subtitle}>Search & download images in bulk</Text>
                </View>
                <Card variant="neon" style={styles.creditBadge}>
                    <Text style={styles.creditIcon}>⚡</Text>
                    <Text style={styles.creditCount}>{user?.credits ?? 0}</Text>
                    <Text style={styles.creditLabel}>credits</Text>
                </Card>
            </View>

            {/* Search Card */}
            <Card style={styles.searchCard}>
                <Text style={styles.sectionLabel}>Search Keyword</Text>
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="e.g. nature, cats, technology..."
                        placeholderTextColor={Colors.textMuted}
                        value={keyword}
                        onChangeText={setKeyword}
                        selectionColor={Colors.neonGreen}
                        returnKeyType="done"
                        onSubmitEditing={handleDownload}
                    />
                </View>

                {/* Count picker */}
                <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
                    Image Count
                </Text>
                <View style={styles.countGrid}>
                    {COUNT_OPTIONS.map(count => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.countChip,
                                selectedCount === count && styles.countChipActive,
                            ]}
                            onPress={() => setSelectedCount(count)}>
                            <Text
                                style={[
                                    styles.countChipText,
                                    selectedCount === count && styles.countChipTextActive,
                                ]}>
                                {count}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.creditHint}>
                    {hasEnoughCredits
                        ? `Uses ${creditsNeeded} credits (${(user?.credits ?? 0) - creditsNeeded} remaining)`
                        : `⚠️ Need ${creditsNeeded - (user?.credits ?? 0)} more credits`}
                </Text>

                <Button
                    title={`Download ${selectedCount} Images`}
                    onPress={handleDownload}
                    loading={loading}
                    disabled={!hasEnoughCredits}
                    style={styles.downloadBtn}
                />
            </Card>

            {/* Result Card */}
            {downloadUrl ? (
                <Card variant="neon" style={styles.resultCard}>
                    <Text style={styles.resultTitle}>✅ ZIP Ready</Text>
                    <Text style={styles.resultSubtitle}>
                        Your images are packaged and ready to download
                    </Text>
                    <Button
                        title="📦 Open ZIP File"
                        onPress={handleOpenZip}
                        variant="outline"
                        style={{ marginTop: Spacing.lg }}
                    />
                </Card>
            ) : null}

            <LoadingOverlay visible={loading} message="Downloading images..." />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Colors.darkBg },
    content: { padding: Spacing.xl, paddingTop: Spacing.xxl },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xxl,
    },
    greeting: {
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
    },
    subtitle: { fontSize: Typography.fontSizeSM, color: Colors.textSecondary, marginTop: 4 },
    creditBadge: { alignItems: 'center', padding: Spacing.md, minWidth: 72 },
    creditIcon: { fontSize: 20 },
    creditCount: {
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.neonGreen,
    },
    creditLabel: { fontSize: Typography.fontSizeXS, color: Colors.textSecondary },
    searchCard: { marginBottom: Spacing.xl },
    sectionLabel: {
        fontSize: Typography.fontSizeSM,
        fontWeight: Typography.fontWeightSemiBold,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    searchRow: {
        backgroundColor: Colors.darkBg,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.darkCardBorder,
        paddingHorizontal: Spacing.lg,
    },
    searchInput: {
        color: Colors.textPrimary,
        fontSize: Typography.fontSizeMD,
        paddingVertical: Spacing.md,
    },
    countGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    countChip: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.round,
        borderWidth: 1.5,
        borderColor: Colors.darkCardBorder,
        backgroundColor: Colors.darkBg,
    },
    countChipActive: {
        borderColor: Colors.neonGreen,
        backgroundColor: Colors.neonGreen + '22',
    },
    countChipText: {
        color: Colors.textSecondary,
        fontWeight: Typography.fontWeightMedium,
        fontSize: Typography.fontSizeSM,
    },
    countChipTextActive: { color: Colors.neonGreen, fontWeight: Typography.fontWeightBold },
    creditHint: {
        color: Colors.textMuted,
        fontSize: Typography.fontSizeXS,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    downloadBtn: { marginTop: Spacing.sm },
    resultCard: { marginBottom: Spacing.xl },
    resultTitle: {
        fontSize: Typography.fontSizeLG,
        fontWeight: Typography.fontWeightBold,
        color: Colors.neonGreen,
        marginBottom: Spacing.sm,
    },
    resultSubtitle: { color: Colors.textSecondary, fontSize: Typography.fontSizeSM },
});
