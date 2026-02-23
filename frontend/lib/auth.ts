import { User } from '@/types';

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                return null;
            }
        }
    }
    return null;
};

export const setUser = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        // Dispatch event to notify other components (like Navbar)
        window.dispatchEvent(new Event('authChange'));
    }
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    const user = getUser();
    // Both token and valid user must exist
    return token !== null && token !== '' && user !== null && user.email !== undefined;
};

export const logout = (): void => {
    removeToken();
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};
