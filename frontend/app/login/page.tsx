'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { AuthResponse } from '@/types';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<AuthResponse>('/auth/login', { email, password });
            setToken(response.data.token);
            setUser(response.data.user);
            window.dispatchEvent(new Event('authChange'));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-md w-full glass-card rounded-2xl p-6 md:p-10 relative z-10 animate-slideUp mx-auto">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-3 gradient-text">Welcome Back</h1>
                    <p className="text-gray-400 text-base md:text-lg">Login to your ImageBulk account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg text-center text-sm">
                        {error}
                    </div>
                )}

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
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-4 btn-neon rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? '⏳ Logging in...' : '🚀 Login'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-neon-green hover:text-neon-cyan font-bold transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
