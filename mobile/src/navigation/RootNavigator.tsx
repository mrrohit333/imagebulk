import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { LoadingOverlay } from '../components/LoadingOverlay';

export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show full-screen loader while reading token from encrypted storage
    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="App" component={AppNavigator} />
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
};
