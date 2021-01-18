import * as React from 'react';
import { themes } from './themes';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeKey } from '../types';

type ThemeContextType = [ThemeKey, React.Dispatch<ThemeKey>];

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<ThemeKey>(
    (): ThemeKey => {
      const savedThemeValue: string | null = localStorage.getItem('theme');
      const savedTheme: number = savedThemeValue ? Number(localStorage.getItem('theme')) : -1;

      const preferredColorScheme: ThemeKey = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeKey.dark
        : ThemeKey.light;

      return savedTheme in ThemeKey ? savedTheme : preferredColorScheme;
    }
  );

  function userSetTheme(theme: ThemeKey) {
    setTheme(theme);
    window.localStorage.setItem('theme', theme.toString());
  }

  return (
    <ThemeContext.Provider value={[theme, userSetTheme]}>
      <StyledComponentsThemeProvider theme={themes[theme]}>{children}</StyledComponentsThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('You must use useTheme inside of a ThemeProvider');
  }
  return context;
}
