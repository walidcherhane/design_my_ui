import React, { useContext } from 'react';

const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('color-theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs;
        }

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'dark';
        }
    }

   return 'light' // light theme as the default;
};

const ThemeContext = React.createContext();
  
export function useTheme() {
    return useContext(ThemeContext);
  }
export const ThemeProvider = ({ initialTheme, children }) => {
    const [theme, setTheme] = React.useState(getInitialTheme);

    const rawSetTheme = (rawTheme) => {
        const root = window.document.documentElement;
        const isDark = rawTheme === 'dark';

        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(rawTheme);

        localStorage.setItem('color-theme', rawTheme);
    };

    if (initialTheme) {
        rawSetTheme(initialTheme);
    }

    React.useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);
    const values = {
        theme, setTheme
    }
    return (
        <ThemeContext.Provider value={values}>
            {children}
        </ThemeContext.Provider>
    );
};