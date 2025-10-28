import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDarkMode: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            // Replace default blue with red
            primary: {
                main: '#d32f2f', // MUI red 700-ish
            },
            secondary: {
                main: '#dc004e',
            },
            // Background colors for light/dark modes
            background: {
                default: darkMode ? '#072b07' : '#e8f5e9', // dark green / light green
                paper: darkMode ? '#0b3d0b' : '#ffffff'
            },
            // Keep contrast text automatic, but explicitly set text color for clarity
            text: {
                primary: darkMode ? '#e8f5e9' : 'rgba(0,0,0,0.87)'
            }
        },
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};