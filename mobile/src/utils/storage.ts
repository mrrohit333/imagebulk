import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'imagebulk_auth_token';
const USER_KEY = 'imagebulk_user';

export const Storage = {
    // ── Token ────────────────────────────────────────────────────
    async getToken(): Promise<string | null> {
        try {
            return await EncryptedStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    },

    async setToken(token: string): Promise<void> {
        await EncryptedStorage.setItem(TOKEN_KEY, token);
    },

    async removeToken(): Promise<void> {
        await EncryptedStorage.removeItem(TOKEN_KEY);
    },

    // ── User ─────────────────────────────────────────────────────
    async getUser<T = unknown>(): Promise<T | null> {
        try {
            const raw = await EncryptedStorage.getItem(USER_KEY);
            return raw ? (JSON.parse(raw) as T) : null;
        } catch {
            return null;
        }
    },

    async setUser(user: unknown): Promise<void> {
        await EncryptedStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    async removeUser(): Promise<void> {
        await EncryptedStorage.removeItem(USER_KEY);
    },

    // ── Clear all ────────────────────────────────────────────────
    async clearAll(): Promise<void> {
        await EncryptedStorage.clear();
    },
};
