'use client';

import Link from 'next/link';
import { logout, getUser, getToken } from '@/lib/auth';
import { useEffect, useState, FormEvent } from 'react';
import { User } from '@/types';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    // Feedback form state
    const [menuOpen, setMenuOpen] = useState(false);

    // Feedback form state
    const [fbName, setFbName] = useState('');
    const [fbEmail, setFbEmail] = useState('');
    const [fbMessage, setFbMessage] = useState('');
    const [fbSent, setFbSent] = useState(false);

    const refreshAuth = () => {
        const token = getToken();
        const storedUser = getUser();
        if (token && storedUser && storedUser.email) {
            setUser(storedUser);
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        setMounted(true);
        refreshAuth();

        const handleStorageChange = () => refreshAuth();
        const handleAuthChange = () => refreshAuth();

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
        setMenuOpen(false);
        window.dispatchEvent(new Event('authChange'));
    };

    const handleFeedbackSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fbName, email: fbEmail, message: fbMessage }),
            });
            if (!res.ok) throw new Error('Failed');
            setFbSent(true);
            setTimeout(() => {
                setFbSent(false);
                setFbName('');
                setFbEmail('');
                setFbMessage('');
                setContactOpen(false);
            }, 2500);
        } catch {
            alert('Failed to send message. Please email us directly at mrproducts.pvtltd@gmail.com');
        }
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
        <>
            <nav className="glass-card fixed top-0 left-0 right-0 z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center neon-glow-green relative overflow-hidden">
                                <span className="text-dark-bg font-black text-base md:text-xl relative z-10">📷</span>
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="font-black text-lg md:text-xl gradient-text">ImageBulk</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            {/* Contact Us — always visible */}
                            <button
                                onClick={() => setContactOpen(true)}
                                className="text-gray-300 hover:text-neon-cyan transition-colors relative group text-sm font-semibold"
                            >
                                Contact Us
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink group-hover:w-full transition-all duration-300"></span>
                            </button>

                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-300 hover:text-neon-green transition-colors relative group text-sm font-semibold"
                                    >
                                        Dashboard
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-cyan group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="text-gray-300 hover:text-neon-cyan transition-colors relative group text-sm font-semibold"
                                    >
                                        Pricing
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-4 py-1.5 glass-card text-neon-green text-xs font-bold rounded-full neon-glow-green animate-neon-pulse">
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
                                <>
                                    <Link
                                        href="/pricing"
                                        className="text-gray-300 hover:text-neon-cyan transition-colors relative group text-sm font-semibold"
                                    >
                                        Pricing
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="text-gray-300 hover:text-neon-green transition-colors relative group text-sm font-semibold"
                                    >
                                        Login
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-green to-neon-cyan group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-6 py-2 btn-neon rounded-lg transition-all text-sm font-bold shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-gray-300 hover:text-white p-2"
                            >
                                {menuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {menuOpen && (
                    <div className="md:hidden glass-card border-t border-white/10 px-4 py-6 space-y-4 animate-fadeIn">
                        <button
                            onClick={() => { setContactOpen(true); setMenuOpen(false); }}
                            className="block w-full text-left text-gray-300 hover:text-neon-cyan font-bold py-2"
                        >
                            📞 Contact Us
                        </button>

                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-gray-300 hover:text-neon-green font-bold py-2"
                                >
                                    📊 Dashboard
                                </Link>
                                <Link
                                    href="/pricing"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-gray-300 hover:text-neon-cyan font-bold py-2"
                                >
                                    💎 Pricing
                                </Link>
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    <div className="px-4 py-2 glass-card text-neon-green text-sm font-bold rounded-xl text-center">
                                        ⚡ {user.credits} credits
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-6 py-3 glass-card text-gray-300 font-bold rounded-xl"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/pricing"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-gray-300 hover:text-neon-cyan font-bold py-2"
                                >
                                    💎 Pricing
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-gray-300 hover:text-neon-green font-bold py-2"
                                >
                                    🔑 Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="block w-full px-6 py-3 btn-neon rounded-xl font-bold text-center mt-4"
                                >
                                    🚀 Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>


            {/* ── Contact Us Modal ── */}
            {contactOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl overflow-hidden animate-slideUp"
                        style={{
                            background: 'linear-gradient(135deg, #0f0f1a 0%, #15151f 100%)',
                            border: '1px solid rgba(0,255,157,0.25)',
                            boxShadow: '0 0 60px rgba(0,255,157,0.15), 0 25px 50px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'linear-gradient(135deg, #00ff9d, #00d9ff)', padding: '20px 28px' }}
                            className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">📬 Contact Us</h2>
                                <p className="text-gray-800 text-sm font-medium">We'd love to hear from you!</p>
                            </div>
                            <button
                                onClick={() => setContactOpen(false)}
                                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-gray-900 hover:bg-black/20 transition-colors text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-7 space-y-6">
                            {/* Company Info */}
                            <div className="rounded-xl p-5 space-y-3"
                                style={{ background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)' }}>
                                <h3 className="text-neon-green font-bold text-sm uppercase tracking-widest mb-3">Company Details</h3>
                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">👤</span>
                                        <div>
                                            <p className="text-gray-500 text-xs">Owner</p>
                                            <p className="text-white font-semibold">ROHIT</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📍</span>
                                        <div>
                                            <p className="text-gray-500 text-xs">Location</p>
                                            <p className="text-white font-semibold">Namakkal, TamilNadu, India</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📞</span>
                                        <div>
                                            <p className="text-gray-500 text-xs">Phone</p>
                                            <a href="tel:+916379651694" className="text-neon-cyan font-semibold hover:text-neon-green transition-colors">+91 6379651694</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">✉️</span>
                                        <div>
                                            <p className="text-gray-500 text-xs">Email</p>
                                            <a href="mailto:mrproducts.pvtltd@gmail.com" className="text-neon-cyan font-semibold hover:text-neon-green transition-colors">mrproducts.pvtltd@gmail.com</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Form */}
                            <div>
                                <h3 className="text-neon-cyan font-bold text-sm uppercase tracking-widest mb-4">Send Feedback</h3>
                                {fbSent ? (
                                    <div className="text-center py-8">
                                        <div className="text-5xl mb-3">🎉</div>
                                        <p className="text-neon-green font-bold text-lg">Message Sent!</p>
                                        <p className="text-gray-400 text-sm mt-1">We'll get back to you soon.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-1">Your Name</label>
                                                <input
                                                    type="text"
                                                    value={fbName}
                                                    onChange={(e) => setFbName(e.target.value)}
                                                    required
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-1">Your Email</label>
                                                <input
                                                    type="email"
                                                    value={fbEmail}
                                                    onChange={(e) => setFbEmail(e.target.value)}
                                                    required
                                                    placeholder="you@example.com"
                                                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-1">Message</label>
                                            <textarea
                                                value={fbMessage}
                                                onChange={(e) => setFbMessage(e.target.value)}
                                                required
                                                rows={3}
                                                placeholder="Share your feedback, suggestions, or questions..."
                                                className="w-full px-4 py-2.5 rounded-lg text-sm resize-none"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 rounded-xl font-black text-sm transition-all"
                                            style={{ background: 'linear-gradient(135deg, #00ff9d, #00d9ff)', color: '#0a0a0f' }}
                                        >
                                            🚀 Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
