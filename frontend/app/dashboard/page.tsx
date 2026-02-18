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
            <div className="max-w-6xl mx-auto px-4 py-24">
                {/* Header with Credits */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text animate-slideDown">Dashboard</h1>
                    <p className="text-gray-400 text-xl">
                        Welcome back! You have{' '}
                        <span className="px-4 py-1.5 glass-card text-neon-green font-bold rounded-full neon-glow-green animate-neon-pulse inline-block">
                            ⚡ {user?.credits || 0} credits
                        </span>{' '}
                        remaining.
                    </p>
                </div>

                {/* Download Form */}
                <div className="glass-card rounded-2xl p-10 mb-10 animate-slideUp neon-border-animated">
                    <h2 className="text-3xl font-black mb-8 gradient-text">Download Images</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/50 text-neon-pink rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/50 text-neon-green rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleDownload} className="space-y-8">
                        <div>
                            <label htmlFor="keyword" className="block text-sm font-bold text-gray-300 mb-3">
                                🔍 Search Keyword
                            </label>
                            <input
                                id="keyword"
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                required
                                className="w-full px-6 py-4 rounded-xl text-lg font-medium"
                                placeholder="e.g., sunset, business, technology"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label htmlFor="count" className="block text-sm font-bold text-gray-300">
                                    📊 Number of Images
                                </label>
                                <span className="text-3xl font-black text-neon-cyan">{count}</span>
                            </div>
                            <input
                                id="count"
                                type="range"
                                min="10"
                                max="100"
                                step="10"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>10</span>
                                <span>50</span>
                                <span>100</span>
                            </div>
                            <p className="text-gray-400 text-sm mt-3">
                                💰 Cost: <span className="text-neon-green font-bold">{count} credits</span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !user || user.credits < count}
                            className="w-full px-8 py-5 btn-neon rounded-xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '⏳ Downloading...' : `⬇️ Download ${count} Images`}
                        </button>

                        {user && user.credits < count && (
                            <p className="text-neon-pink text-sm text-center font-semibold">
                                ⚠️ Insufficient credits. Please purchase more credits.
                            </p>
                        )}
                    </form>
                </div>

                {/* Download History */}
                <div className="glass-card rounded-2xl p-10 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-3xl font-black mb-8 gradient-text">Download History</h2>
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
