import React from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Colors, Typography } from '../theme';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    message,
}) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.backdrop}>
                <View style={styles.box}>
                    <ActivityIndicator color={Colors.neonGreen} size="large" />
                    {message ? (
                        <Text style={styles.message}>{message}</Text>
                    ) : null}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: Colors.overlay,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        backgroundColor: Colors.darkCard,
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        minWidth: 160,
        borderWidth: 1,
        borderColor: Colors.glassCardBorder,
    },
    message: {
        color: Colors.textSecondary,
        fontSize: Typography.fontSizeSM,
        marginTop: 12,
        textAlign: 'center',
    },
});
