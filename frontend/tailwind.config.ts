import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0a0a0f',
                    surface: '#15151f',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
                neon: {
                    green: '#00ff9d',
                    cyan: '#00d9ff',
                    pink: '#ff006e',
                    purple: '#a855f7',
                },
                primary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'fadeIn': 'fadeIn 0.6s ease-out',
                'slideUp': 'slideUp 0.6s ease-out',
                'slideDown': 'slideDown 0.4s ease-out',
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                        transform: 'scale(1)',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)',
                        transform: 'scale(1.02)',
                    },
                },
                'neon-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(0, 255, 157, 0.4), 0 0 40px rgba(0, 255, 157, 0.2)',
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(0, 255, 157, 0.8), 0 0 60px rgba(0, 255, 157, 0.4)',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
