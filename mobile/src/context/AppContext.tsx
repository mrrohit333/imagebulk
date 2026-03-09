import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import Toast from 'react-native-toast-message';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';

interface AppContextValue {
    isGlobalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
    showToast: (type: ToastType, title: string, message?: string) => void;
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isGlobalLoading, setGlobalLoading] = useState(false);

    const showToast = useCallback(
        (type: ToastType, title: string, message?: string) => {
            Toast.show({
                type,
                text1: title,
                text2: message,
                position: 'top',
                visibilityTime: 3000,
            });
        },
        [],
    );

    const value = useMemo(
        () => ({ isGlobalLoading, setGlobalLoading, showToast }),
        [isGlobalLoading, showToast],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export const useApp = (): AppContextValue => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
