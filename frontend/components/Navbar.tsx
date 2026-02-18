'use client';

import Link from 'next/link';
import { logout, getUser, getToken } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);

    const refreshAuth = () => {
        const token = getToken();
        const storedUser = getUser();
        // Only set user if BOTH token and valid user data exist
        if (token && storedUser && storedUser.email) {
            setUser(storedUser);
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        setMounted(true);
        refreshAuth();

        // Listen for storage changes (login/logout in same or other tabs)
        const handleStorageChange = () => {
            refreshAuth();
        };

        // Listen for custom auth events dispatched after login/logout
        const handleAuthChange = () => {
            refreshAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        window.dispatchEvent(new Event('authChange'));
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <nav className="glass-card fixed top-0 left-0 right-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center">
                                <span className="text-dark-bg font-black text-xl">📷</span>
                            </div>
                            <span className="font-black text-xl gradient-text">ImageBulk</span>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="glass-card fixed top-0 left-0 right-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo with Neon Glow */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center neon-glow-green relative overflow-hidden">
                            <span className="text-dark-bg font-black text-xl relative z-10">📷</span>
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="font-black text-xl gradient-text">ImageBulk</span>
                    </Link>

                    {/* Navigation Links - conditionally render based on auth state */}
                    <div className="flex items-center space-x-8">
                        {user ? (
                            // LOGGED IN STATE
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-neon-green transition-colors relative group"
                                >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-cyan group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="text-gray-300 hover:text-neon-cyan transition-colors relative group"
                                >
                                    Pricing
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <span className="px-4 py-1.5 glass-card text-neon-green text-sm font-bold rounded-full neon-glow-green animate-neon-pulse">
                                        ⚡ {user.credits} credits
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-6 py-2 glass-card hover:bg-white/10 text-gray-300 rounded-lg transition-all text-sm font-semibold"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            // LOGGED OUT STATE
                            <>
                                <Link
                                    href="/pricing"
                                    className="text-gray-300 hover:text-neon-cyan transition-colors relative group"
                                >
                                    Pricing
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-neon-green transition-colors relative group"
                                >
                                    Login
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-cyan group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 btn-neon rounded-lg transition-all text-sm font-bold"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
