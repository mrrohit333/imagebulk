import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react';
import { AuthService, User } from '../services/authService';
import { Storage } from '../utils/storage';
import { registerUnauthorizedCallback } from '../services/api';

// ─────────────────────────────────────────────────────────────
// State types
// ─────────────────────────────────────────────────────────────
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean; // true during initial token check
}

type AuthAction =
    | { type: 'AUTH_LOADING' }
    | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'UPDATE_USER'; payload: User };

interface AuthContextValue extends AuthState {
    login: (token: string, user: User) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_LOADING':
            return { ...state, isLoading: true };
        case 'AUTH_SUCCESS':
            return {
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'AUTH_LOGOUT':
            return { user: null, token: null, isAuthenticated: false, isLoading: false };
        case 'UPDATE_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // ── Bootstrap: check stored credentials on app launch ──────
    useEffect(() => {
        const bootstrap = async () => {
            try {
                const [token, user] = await Promise.all([
                    Storage.getToken(),
                    Storage.getUser<User>(),
                ]);
                if (token && user) {
                    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
                } else {
                    dispatch({ type: 'AUTH_LOGOUT' });
                }
            } catch {
                dispatch({ type: 'AUTH_LOGOUT' });
            }
        };
        bootstrap();
    }, []);

    // ── Register 401 callback so Axios can trigger logout ──────
    useEffect(() => {
        registerUnauthorizedCallback(() => {
            dispatch({ type: 'AUTH_LOGOUT' });
        });
    }, []);

    const login = useCallback(async (token: string, user: User) => {
        await Promise.all([Storage.setToken(token), Storage.setUser(user)]);
        dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
    }, []);

    const logout = useCallback(async () => {
        await Storage.clearAll();
        dispatch({ type: 'AUTH_LOGOUT' });
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const user = await AuthService.getMe();
            await Storage.setUser(user);
            dispatch({ type: 'UPDATE_USER', payload: user });
        } catch {
            // If refresh fails, keep existing state
        }
    }, []);

    const deleteAccount = useCallback(async () => {
        await AuthService.deleteAccount();
        await Storage.clearAll();
        dispatch({ type: 'AUTH_LOGOUT' });
    }, []);

    const value = useMemo(
        () => ({ ...state, login, logout, refreshUser, deleteAccount }),
        [state, login, logout, refreshUser, deleteAccount],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
