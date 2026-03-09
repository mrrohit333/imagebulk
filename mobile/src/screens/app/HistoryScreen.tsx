import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../components/Card';
import { DownloadService, DownloadHistoryItem } from '../../services/downloadService';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography } from '../../theme';

export const HistoryScreen: React.FC = () => {
    const { showToast } = useApp();
    const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchHistory = useCallback(async (isRefresh = false) => {
        if (isRefresh) { setRefreshing(true); }
        try {
            const data = await DownloadService.getHistory();
            setHistory(data);
        } catch (err: any) {
            showToast('error', 'Error', err?.response?.data?.error || 'Could not load download history');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDelete = (item: DownloadHistoryItem) => {
        Alert.alert(
            'Remove Entry',
            `Remove "${item.keyword}" from your history?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingId(item._id);
                        try {
                            await DownloadService.deleteHistory(item._id);
                            // Remove from local state instantly — no refetch needed
                            setHistory(prev => prev.filter(h => h._id !== item._id));
                            showToast('success', 'Removed', 'History entry deleted');
                        } catch {
                            showToast('error', 'Error', 'Could not delete entry');
                        } finally {
                            setDeletingId(null);
                        }
                    },
                },
            ],
        );
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const renderItem = ({ item }: { item: DownloadHistoryItem }) => {
        const isDeleting = deletingId === item._id;
        return (
            <Card style={[styles.card, isDeleting && styles.cardDeleting]}>
                <View style={styles.cardHeader}>
                    <View style={styles.keywordBadge}>
                        <Text style={styles.keywordText}>🔍 {item.keyword}</Text>
                    </View>

                    {/* Delete button */}
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(item)}
                        disabled={isDeleting}>
                        <Text style={styles.deleteIcon}>{isDeleting ? '⏳' : '🗑️'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{item.count}</Text>
                        <Text style={styles.statLabel}>Images</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{formatDate(item.timestamp)}</Text>
                        <Text style={styles.statLabel}>Date</Text>
                    </View>
                </View>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={Colors.neonGreen} size="large" />
            </View>
        );
    }

    return (
        <FlatList
            style={styles.screen}
            contentContainerStyle={history.length === 0 ? styles.emptyContainer : styles.list}
            data={history}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => fetchHistory(true)}
            ListHeaderComponent={
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Download History</Text>
                    {history.length > 0 && (
                        <Text style={styles.count}>{history.length} entries</Text>
                    )}
                </View>
            }
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>📂</Text>
                    <Text style={styles.emptyText}>No downloads yet</Text>
                    <Text style={styles.emptySubtext}>
                        Head to Dashboard to download your first batch!
                    </Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Colors.darkBg },
    list: { padding: Spacing.xl },
    emptyContainer: { flex: 1, padding: Spacing.xl },
    center: { flex: 1, backgroundColor: Colors.darkBg, alignItems: 'center', justifyContent: 'center' },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
    },
    count: {
        color: Colors.textMuted,
        fontSize: Typography.fontSizeSM,
    },
    card: { marginBottom: Spacing.lg },
    cardDeleting: { opacity: 0.5 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    keywordBadge: {
        backgroundColor: Colors.neonGreen + '22',
        borderRadius: Radius.round,
        paddingVertical: 4,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.neonGreen + '55',
        flex: 1,
        marginRight: Spacing.md,
    },
    keywordText: { color: Colors.neonGreen, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeSM },
    deleteBtn: {
        padding: Spacing.sm,
        backgroundColor: Colors.error + '18',
        borderRadius: Radius.sm,
        borderWidth: 1,
        borderColor: Colors.error + '44',
    },
    deleteIcon: { fontSize: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'center' },
    stat: { alignItems: 'center', paddingHorizontal: Spacing.xxl },
    statValue: {
        fontSize: Typography.fontSizeLG,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
    },
    statLabel: { color: Colors.textSecondary, fontSize: Typography.fontSizeXS, marginTop: 2 },
    divider: { width: 1, backgroundColor: Colors.darkCardBorder, marginVertical: 4 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
    emptyText: {
        fontSize: Typography.fontSizeXL,
        fontWeight: Typography.fontWeightBold,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    emptySubtext: { color: Colors.textSecondary, fontSize: Typography.fontSizeMD, textAlign: 'center' },
});
