import * as React from 'react';
import { themes } from './themes';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeKey } from '../types';
import { useStickyPrimitiveState } from '../hooks/useStickyState';

type ThemeContextType = [ThemeKey, React.Dispatch<ThemeKey>];

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useStickyPrimitiveState<ThemeKey>(ThemeKey.light, 'theme');

  // Handle how you want to set and save theme here

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
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
