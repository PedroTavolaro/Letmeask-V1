
import { createContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextProviderProps = {
    children: ReactNode
}

type themeContextType = {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext({} as themeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {

    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const storagedTheme = localStorage.getItem('theme')
        
        return (storagedTheme ?? 'light') as Theme;
    });

    useEffect(() => {
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme])

    function toggleTheme(){
        setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}