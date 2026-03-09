import api from './api';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface DownloadPayload {
    keyword: string;
    count: number;
}

export interface DownloadResult {
    message: string;
    downloadUrl: string;
    imagesDownloaded: number;
    creditsUsed: number;
    remainingCredits: number;
}

// Matches backend DownloadLog model: userId, keyword, count, timestamp
export interface DownloadHistoryItem {
    _id: string;
    keyword: string;
    count: number;
    timestamp: string;  // backend uses 'timestamp', NOT createdAt
    // downloadUrl and creditsUsed do NOT exist in DownloadLog model
}

// ─────────────────────────────────────────────────────────────
// Download API service
// ─────────────────────────────────────────────────────────────
export const DownloadService = {
    /**
     * Search & download images, returns a ZIP file directly.
     * Deducts credits from the user's account.
     */
    downloadImages: async (payload: DownloadPayload): Promise<DownloadResult> => {
        const { data } = await api.post<DownloadResult>('/api/downloads', payload);
        return data;
    },

    /**
     * Fetch the authenticated user's download history.
     * Backend returns { history: DownloadHistoryItem[] }
     */
    getHistory: async (): Promise<DownloadHistoryItem[]> => {
        const { data } = await api.get<{ history: DownloadHistoryItem[] }>('/api/downloads/history');
        return data.history;  // backend returns 'history', not 'downloads'
    },

    /**
     * Delete a single history entry by ID.
     */
    deleteHistory: async (id: string): Promise<void> => {
        await api.delete(`/api/downloads/history/${id}`);
    },
};
