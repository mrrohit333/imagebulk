import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { PaymentService, RazorpayOrder } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { Config } from '../../config/env';

// ─────────────────────────────────────────────────────────────
// Pricing Plans
// ─────────────────────────────────────────────────────────────
const PLANS = [
    {
        id: 'Basic',           // must match backend PRICING key exactly
        name: 'Basic',
        credits: 500,
        amount: 2900,          // ₹29 in paise
        displayPrice: '₹29',
        popular: false,
        color: Colors.neonCyan,
    },
    {
        id: 'Pro',             // must match backend PRICING key exactly
        name: 'Pro',
        credits: 1000,
        amount: 4900,          // ₹49 in paise
        displayPrice: '₹49',
        popular: true,
        color: Colors.neonGreen,
    },
];

// ─────────────────────────────────────────────────────────────
// Razorpay Checkout HTML — runs the JS SDK inside WebView
// ─────────────────────────────────────────────────────────────
const buildRazorpayHTML = (order: RazorpayOrder, user: { name: string; email: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    body { background: #050505; display: flex; align-items: center;
      justify-content: center; min-height: 100vh; margin: 0; }
    p { color: #9ca3af; font-family: sans-serif; text-align: center; }
  </style>
</head>
<body>
  <p>Opening payment gateway...</p>
  <script>
    var options = {
      key: "${order.keyId}",
      amount: "${order.amount}",
      currency: "${order.currency}",
      name: "ImageBulk",
      description: "Buy Credits",
      order_id: "${order.orderId}",
      prefill: { name: "${user.name}", email: "${user.email}" },
      theme: { color: "#00ff88" },
      modal: { ondismiss: function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'dismissed' }));
      }},
      handler: function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          status: 'success',
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature
        }));
      }
    };
    var rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        status: 'failed',
        error: response.error.description
      }));
    });
    rzp.open();
  </script>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────
export const PricingScreen: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const { showToast } = useApp();

    const [orderLoading, setOrderLoading] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<RazorpayOrder | null>(null);
    const [activePlanId, setActivePlanId] = useState<string | null>(null);
    const [webViewHtml, setWebViewHtml] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);

    const handleBuy = async (plan: (typeof PLANS)[0]) => {
        setOrderLoading(true);
        setActivePlanId(plan.id);
        try {
            const order = await PaymentService.createOrder({
                plan: plan.id,  // backend expects { plan: 'Basic' | 'Pro' }
            });
            setCurrentOrder(order);
            setWebViewHtml(
                buildRazorpayHTML(order, { name: user?.name ?? '', email: user?.email ?? '' }),
            );
        } catch (err: any) {
            showToast('error', 'Order Failed', err?.response?.data?.error || 'Try again');
        } finally {
            setOrderLoading(false);
            setActivePlanId(null);
        }
    };

    const handleWebViewMessage = async (event: WebViewMessageEvent) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.status === 'dismissed') {
            setWebViewHtml(null);
            showToast('info', 'Payment Cancelled', 'No charges were made');
        } else if (data.status === 'success') {
            setWebViewHtml(null);
            setVerifying(true);
            try {
                // backend expects: razorpayOrderId, razorpayPaymentId, razorpaySignature
                const result = await PaymentService.verifyPayment({
                    razorpayOrderId: data.orderId,
                    razorpayPaymentId: data.paymentId,
                    razorpaySignature: data.signature,
                });
                await refreshUser();
                showToast('success', '🎉 Credits Added!', `${result.creditsAdded} credits added to your account`);
            } catch {
                showToast('error', 'Verification Failed', 'Contact support if credits are missing');
            } finally {
                setVerifying(false);
            }
        } else if (data.status === 'failed') {
            setWebViewHtml(null);
            Alert.alert('Payment Failed', data.error || 'Payment could not be processed');
        }
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Buy Credits</Text>
                <Text style={styles.subtitle}>Current balance: <Text style={styles.credits}>{user?.credits ?? 0} ⚡</Text></Text>
            </View>

            {/* Plans */}
            {PLANS.map(plan => (
                <Card
                    key={plan.id}
                    variant={plan.popular ? 'neon' : 'default'}
                    style={styles.planCard}>
                    {plan.popular && (
                        <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>Most Popular</Text>
                        </View>
                    )}

                    <View style={styles.planHeader}>
                        <View>
                            <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                            <Text style={styles.planCredits}>{plan.credits} credits</Text>
                        </View>
                        <Text style={styles.planPrice}>{plan.displayPrice}</Text>
                    </View>

                    <Text style={styles.planPerCredit}>
                        ₹{(plan.amount / 100 / plan.credits).toFixed(2)} per credit
                    </Text>

                    <Button
                        title={orderLoading && activePlanId === plan.id ? 'Processing...' : `Buy ${plan.name}`}
                        onPress={() => handleBuy(plan)}
                        loading={orderLoading && activePlanId === plan.id}
                        variant={plan.popular ? 'primary' : 'outline'}
                        style={styles.buyBtn}
                        size="sm"
                    />
                </Card>
            ))}

            {/* Razorpay WebView Modal */}
            <Modal
                visible={!!webViewHtml}
                animationType="slide"
                onRequestClose={() => setWebViewHtml(null)}>
                <View style={styles.webviewContainer}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setWebViewHtml(null)}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                    {webViewHtml ? (
                        <WebView
                            source={{ html: webViewHtml }}
                            onMessage={handleWebViewMessage}
                            javaScriptEnabled
                            domStorageEnabled
                            startInLoadingState
                            renderLoading={() => (
                                <ActivityIndicator style={styles.webviewLoader} color={Colors.neonGreen} size="large" />
                            )}
                        />
                    ) : null}
                </View>
            </Modal>

            <LoadingOverlay visible={verifying} message="Verifying payment..." />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Colors.darkBg },
    content: { padding: Spacing.xl, paddingTop: Spacing.xxl },
    header: { marginBottom: Spacing.xxl },
    title: {
        fontSize: Typography.fontSize2XL,
        fontWeight: Typography.fontWeightBlack,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    subtitle: { fontSize: Typography.fontSizeMD, color: Colors.textSecondary },
    credits: { color: Colors.neonGreen, fontWeight: Typography.fontWeightBold },
    planCard: { marginBottom: Spacing.lg, overflow: 'hidden' },
    popularBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: Colors.neonGreen,
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderBottomLeftRadius: Radius.md,
    },
    popularText: { color: Colors.darkBg, fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightBlack },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
    planName: { fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightBlack, marginBottom: 2 },
    planCredits: { fontSize: Typography.fontSizeSM, color: Colors.textSecondary },
    planPrice: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightBlack, color: Colors.textPrimary },
    planPerCredit: { color: Colors.textMuted, fontSize: Typography.fontSizeXS, marginBottom: Spacing.lg },
    buyBtn: {},
    webviewContainer: { flex: 1, backgroundColor: Colors.darkBg },
    closeBtn: {
        padding: Spacing.lg,
        alignItems: 'flex-end',
        backgroundColor: Colors.darkCard,
    },
    closeIcon: { color: Colors.textSecondary, fontSize: Typography.fontSizeXL },
    webviewLoader: { position: 'absolute', top: '50%', alignSelf: 'center' },
});
