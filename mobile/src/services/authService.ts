import api from './api';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface User {
    _id: string;
    name: string;
    email: string;
    credits: number;
    isVerified: boolean;
    createdAt: string;
    profileImage?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface VerifyEmailPayload {
    email: string;
    otp: string;
}

export interface ResendOTPPayload {
    email: string;
}

export interface UpdateProfilePayload {
    name?: string;
    profileImageBase64?: string;
}

// ─────────────────────────────────────────────────────────────
// Auth API service
// ─────────────────────────────────────────────────────────────
export const AuthService = {
    /**
     * Register a new user. Backend sends OTP email, so no token is returned yet.
     */
    register: async (payload: RegisterPayload): Promise<{ message: string }> => {
        const { data } = await api.post<{ message: string }>('/api/auth/register', payload);
        return data;
    },

    /**
     * Verify email with OTP. Returns JWT + user on success.
     */
    verifyEmail: async (payload: VerifyEmailPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/api/auth/verify-email', payload);
        return data;
    },

    /**
     * Re-send OTP for a given email.
     */
    resendOTP: async (payload: ResendOTPPayload): Promise<{ message: string }> => {
        const { data } = await api.post<{ message: string }>('/api/auth/resend-otp', payload);
        return data;
    },

    /**
     * Login with email + password. Returns JWT + user.
     */
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
        return data;
    },

    /**
     * Get currently authenticated user profile.
     */
    getMe: async (): Promise<User> => {
        const { data } = await api.get<User>('/api/auth/me');
        return data;  // backend returns user object directly, NOT wrapped in { user: ... }
    },

    /**
     * Update user profile (name, avatar base64).
     */
    updateProfile: async (payload: UpdateProfilePayload): Promise<{ message: string; user: User }> => {
        const { data } = await api.put<{ message: string; user: User }>('/api/auth/profile', payload);
        return data;
    },

    /**
     * Delete user account permanently.
     */
    deleteAccount: async (): Promise<{ message: string }> => {
        const { data } = await api.delete<{ message: string }>('/api/auth/account');
        return data;
    },
};
