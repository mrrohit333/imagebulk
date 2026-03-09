import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography } from '../theme';
import { DashboardScreen } from '../screens/app/DashboardScreen';
import { HistoryScreen } from '../screens/app/HistoryScreen';
import { PricingScreen } from '../screens/app/PricingScreen';
import { ProfileScreen } from '../screens/app/ProfileScreen';

export type AppTabParamList = {
    Dashboard: undefined;
    History: undefined;
    Pricing: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// Icon emoji — no native icon library linking needed
const TabIcons: Record<string, { active: string; inactive: string }> = {
    Dashboard: { active: '⚡', inactive: '⚡' },
    History: { active: '📋', inactive: '📋' },
    Pricing: { active: '💎', inactive: '💎' },
    Profile: { active: '👤', inactive: '👤' },
};

export const AppNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.darkCard,
                    borderTopColor: Colors.darkCardBorder,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 6,
                    height: 62,
                },
                tabBarActiveTintColor: Colors.neonGreen,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: Typography.fontSizeXS,
                    fontWeight: Typography.fontWeightMedium,
                    marginTop: 2,
                },
                tabBarIcon: ({ focused, size }) => {
                    const icons = TabIcons[route.name];
                    return (
                        <TabIconText
                            icon={focused ? icons.active : icons.inactive}
                            size={size}
                            focused={focused}
                        />
                    );
                },
            })}>
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Pricing" component={PricingScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

// Simple emoji icon renderer
const TabIconText: React.FC<{
    icon: string;
    size: number;
    focused: boolean;
}> = ({ icon, focused }) => {
    const { Text } = require('react-native');
    return (
        <Text
            style={{
                fontSize: focused ? 22 : 20,
                opacity: focused ? 1 : 0.6,
            }}>
            {icon}
        </Text>
    );
};
