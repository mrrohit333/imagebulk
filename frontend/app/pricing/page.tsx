'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { RazorpayOrderResponse } from '@/types';
import { isAuthenticated } from '@/lib/auth';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const plans = [
    {
        name: 'Free',
        price: 0,
        credits: 20,
        features: ['20 free credits', 'Basic support', 'No credit card required'],
        icon: '🎁',
    },
    {
        name: 'Basic',
        price: 199,
        credits: 500,
        features: ['500 credits', 'Priority support', 'All image formats'],
        popular: true,
        icon: '⚡',
    },
    {
        name: 'Pro',
        price: 499,
        credits: 2000,
        features: ['2000 credits', 'Premium support', 'All features'],
        icon: '🚀',
    },
];

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (plan: string) => {
        if (!isAuthenticated()) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);

        try {
            const response = await api.post<RazorpayOrderResponse>('/payments/razorpay/create-order', {
                plan,
            });

            const { orderId, amount, currency, keyId } = response.data;

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: keyId,
                    amount,
                    currency,
                    name: 'ImageBulk',
                    description: `${plan} Plan Purchase`,
                    order_id: orderId,
                    handler: async (response: any) => {
                        try {
                            await api.post('/payments/razorpay/verify', {
                                razorpayOrderId: orderId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            });

                            alert('Payment successful! Credits added to your account.');
                            window.location.href = '/dashboard';
                        } catch (error) {
                            alert('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: '',
                        email: '',
                    },
                    theme: {
                        color: '#00ff9d',
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                setLoading(false);
            };
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to create order');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 md:py-24 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-neon-green/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-neon-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12 md:mb-20 animate-slideDown px-2">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 md:mb-6 leading-tight">
                        <span className="gradient-text">Simple, Transparent</span>
                        <br />
                        <span className="text-white">Pricing</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that works best for you
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-lg md:max-w-none mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`glass-card rounded-2xl p-6 md:p-8 card-lift animate-slideUp relative flex flex-col ${plan.popular ? 'neon-border-animated ring-2 ring-neon-green/30' : ''
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                    <span className="bg-gradient-to-r from-neon-green to-neon-cyan text-dark-bg px-5 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-black shadow-lg shadow-neon-green/20">
                                        ⭐ POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6 md:mb-8">
                                <div className="text-5xl md:text-6xl mb-4">{plan.icon}</div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-4">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-4xl md:text-5xl font-black gradient-text">₹{plan.price}</span>
                                    {plan.price > 0 && <span className="text-gray-400 text-xs md:text-sm ml-2 font-medium">one-time</span>}
                                </div>
                                <p className="text-xl md:text-2xl font-black text-neon-green tracking-tight">
                                    {plan.credits} credits
                                </p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-gray-300">
                                        <span className="text-neon-green mr-3 text-xl">✓</span>
                                        <span className="text-base">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {plan.price === 0 ? (
                                <Link
                                    href="/register"
                                    className="block w-full px-6 py-4 glass-card hover:border-neon-green rounded-xl font-bold text-center text-white text-lg transition-all"
                                >
                                    Get Started
                                </Link>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(plan.name)}
                                    disabled={loading}
                                    className={`w-full px-6 py-4 rounded-xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${plan.popular
                                        ? 'btn-neon'
                                        : 'glass-card hover:border-neon-cyan text-white'
                                        }`}
                                >
                                    {loading ? '⏳ Processing...' : '💳 Buy Now'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                    <p className="text-gray-400 text-lg">
                        Need more credits?{' '}
                        <a href="mailto:support@imagebulk.com" className="text-neon-cyan hover:text-neon-pink font-bold transition-colors">
                            Contact us
                        </a>{' '}
                        for custom plans
                    </p>
                </div>
            </div>
        </div>
    );
}
