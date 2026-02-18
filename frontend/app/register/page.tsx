'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { AuthResponse } from '@/types';

export default function RegisterPage() {
    const router = useRouter();

    // Step 1: credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2: OTP
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // STEP 1: Validate inputs and send OTP
    const handleCredentialsSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { email, password });
            setStep('otp');
            startResendCooldown();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP → create account → issue JWT
    const handleOTPSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<AuthResponse>('/auth/verify-register-otp', { email, otp });
            setToken(response.data.token);
            setUser(response.data.user);
            window.dispatchEvent(new Event('authChange'));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        setError('');
        try {
            await api.post('/auth/register', { email, password });
            startResendCooldown();
        } catch (err: any) {
            setError('Failed to resend OTP');
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
            {/* Animated Background Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-pink/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-md w-full glass-card rounded-2xl p-10 relative z-10 animate-slideUp">

                {/* ── STEP 1: Credentials ── */}
                {step === 'credentials' && (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-black mb-3 gradient-text">Create Account</h1>
                            <p className="text-gray-400 text-lg">
                                Get started with <span className="text-neon-green font-bold">20 free credits</span> 🎉
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg text-center text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2">
                                    📧 Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 rounded-xl text-lg"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2">
                                    🔒 Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 rounded-xl text-lg"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-300 mb-2">
                                    🔒 Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 rounded-xl text-lg"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 btn-neon rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? '📨 Sending OTP...' : '🚀 Continue'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-neon-cyan hover:text-neon-pink font-bold transition-colors">
                                Login
                            </Link>
                        </p>
                    </>
                )}

                {/* ── STEP 2: OTP Verification ── */}
                {step === 'otp' && (
                    <>
                        <div className="text-center mb-10">
                            <div className="text-6xl mb-4">📬</div>
                            <h1 className="text-3xl font-black mb-3 gradient-text">Verify Your Email</h1>
                            <p className="text-gray-400">
                                We sent a 6-digit OTP to
                            </p>
                            <p className="text-neon-green font-bold mt-1">{email}</p>
                            <p className="text-gray-500 text-sm mt-2">Enter it below to create your account</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg text-center text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleOTPSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-bold text-gray-300 mb-2">
                                    🔢 Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    autoFocus
                                    className="w-full px-5 py-4 rounded-xl text-3xl font-black text-center tracking-[0.5em]"
                                    placeholder="000000"
                                />
                                <p className="text-gray-500 text-xs mt-2 text-center">OTP expires in 5 minutes</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full px-6 py-4 btn-neon rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '⏳ Creating Account...' : '✅ Verify & Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center space-y-3">
                            <button
                                onClick={handleResendOTP}
                                disabled={resendCooldown > 0}
                                className="text-sm text-gray-400 hover:text-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resendCooldown > 0
                                    ? `Resend OTP in ${resendCooldown}s`
                                    : '📨 Resend OTP'}
                            </button>
                            <br />
                            <button
                                onClick={() => { setStep('credentials'); setError(''); setOtp(''); }}
                                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                ← Back
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
