'use client';

import { useState, useEffect, FormEvent } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { User, DownloadLog } from '@/types';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [keyword, setKeyword] = useState('');
    const [count, setCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [history, setHistory] = useState<DownloadLog[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await api.get('/auth/me');
                setUser(userResponse.data);

                const historyResponse = await api.get('/downloads/history');
                setHistory(historyResponse.data.history);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const handleDownload = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post(
                '/downloads',
                { keyword, count },
                { responseType: 'blob' }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${keyword}_images.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setSuccess(`Successfully downloaded ${count} images!`);

            // Refresh user data and history
            const userResponse = await api.get('/auth/me');
            setUser(userResponse.data);

            const historyResponse = await api.get('/downloads/history');
            setHistory(historyResponse.data.history);

            setKeyword('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to download images');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
                {/* Header with Credits */}
                <div className="mb-8 md:mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 gradient-text animate-slideDown">Dashboard</h1>
                    <div className="text-gray-400 text-lg md:text-xl">
                        Welcome back! You have{' '}
                        <span className="px-4 py-1.5 glass-card text-neon-green font-bold rounded-full neon-glow-green animate-neon-pulse inline-block mt-2 sm:mt-0">
                            ⚡ {user?.credits || 0} credits
                        </span>{' '}
                        remaining.
                    </div>
                </div>

                {/* Download Form */}
                <div className="glass-card rounded-2xl p-6 md:p-10 mb-8 md:mb-10 animate-slideUp neon-border-animated">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 gradient-text">Download Images</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/50 text-neon-green rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleDownload} className="space-y-6 md:space-y-8">
                        <div>
                            <label htmlFor="keyword" className="block text-xs md:text-sm font-bold text-gray-400 mb-2 md:mb-3 uppercase tracking-wider">
                                🔍 Search Keyword
                            </label>
                            <input
                                id="keyword"
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                required
                                className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-xl text-base md:text-lg font-medium"
                                placeholder="e.g., sunset, business, technology"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 md:mb-3">
                                <label htmlFor="count" className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                                    📊 Number of Images
                                </label>
                                <span className="text-2xl md:text-3xl font-black text-neon-cyan">{count}</span>
                            </div>
                            <input
                                id="count"
                                type="range"
                                min="10"
                                max="100"
                                step="10"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full h-8 cursor-pointer accent-neon-cyan"
                            />
                            <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mt-1">
                                <span>10</span>
                                <span>50</span>
                                <span>100</span>
                            </div>
                            <p className="text-gray-400 text-xs md:text-sm mt-3 font-medium">
                                💰 Cost: <span className="text-neon-green font-bold">{count} credits</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !user || user.credits < count}
                            className="w-full px-6 md:px-8 py-4 md:py-5 btn-neon rounded-xl font-black text-lg md:text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? '⏳ Processing...' : `⬇️ Download ${count} Images`}
                        </button>

                        {user && user.credits < count && (
                            <p className="text-neon-pink text-xs md:text-sm text-center font-bold animate-pulse">
                                ⚠️ Insufficient credits. Please purchase more.
                            </p>
                        )}
                    </form>
                </div>

                {/* Download History */}
                <div className="glass-card rounded-2xl p-6 md:p-10 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 gradient-text text-center md:text-left">Download History</h2>
                    {history.length === 0 ? (
                        <p className="text-gray-400 text-center py-12 text-lg">
                            📭 No downloads yet. Start by searching for images above!
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-neon-green uppercase tracking-wider">
                                            Keyword
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-neon-cyan uppercase tracking-wider">
                                            Images
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-neon-pink uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {history.map((log) => (
                                        <tr key={log._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-white">
                                                {log.keyword}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-400">
                                                {log.count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-400">
                                                {new Date(log.timestamp).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
