'use client';

import Link from 'next/link';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export default function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden animate-slideUp neon-border-animated shadow-2xl">
                <div className="p-8 text-center">
                    {/* Animated Checkmark */}
                    <div className="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 neon-glow-green">
                        <svg className="w-10 h-10 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-black gradient-text mb-4">{title}</h2>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="block w-full py-4 btn-neon rounded-xl font-black text-lg shadow-lg hover:scale-105 transition-all"
                            onClick={onClose}
                        >
                            📊 Go to Dashboard
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 hover:text-white font-bold transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="h-2 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-pink"></div>
            </div>
        </div>
    );
}
