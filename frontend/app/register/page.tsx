'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { AuthResponse } from '@/types';

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Signup, 2: Verification
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

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
            const response = await api.post('/auth/register', { email, password });
            setMessage(response.data.message);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<AuthResponse>('/auth/verify-email', { email, otp });
            setToken(response.data.token);
            setUser(response.data.user);
            window.dispatchEvent(new Event('authChange'));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/resend-otp', { email });
            setMessage(response.data.message);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-pink/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-md w-full glass-card rounded-2xl p-6 md:p-10 relative z-10 animate-slideUp mx-auto">
                <div className="text-center mb-8 md:mb-10 px-2">
                    <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-3 gradient-text">
                        {step === 1 ? 'Create Account' : 'Verify Email'}
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg">
                        {step === 1 ? (
                            <>Get started with <span className="text-neon-green font-bold">20 free credits</span> 🎉</>
                        ) : (
                            <>We've sent a code to <span className="text-white font-bold">{email}</span></>
                        )}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg text-center text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/50 text-neon-green rounded-lg text-center text-sm font-bold">
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                autoComplete="email"
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
                                autoComplete="new-password"
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
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 btn-neon rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? '⏳ Processing...' : '🚀 Create Account'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-bold text-gray-300 mb-2">
                                🔢 6-Digit Code
                            </label>
                            <input
                                id="otp"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                                className="w-full px-5 py-4 rounded-xl text-center text-3xl font-black tracking-[1em] text-neon-green bg-black/40 border-2 border-neon-green/30 focus:border-neon-green"
                                placeholder="000000"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 btn-neon rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '⏳ Verifying...' : '💎 Verify & Start'}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={loading}
                                className="text-gray-400 hover:text-white transition-colors text-sm font-bold underline"
                            >
                                Didn't get a code? Resend
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-8 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-neon-cyan hover:text-neon-pink font-bold transition-colors">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
