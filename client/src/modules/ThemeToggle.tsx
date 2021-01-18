import * as React from 'react';
import { ThemeKey } from '../types';
import { useTheme } from '../theme/ThemeProvider';

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  function handleThemeToggle() {
    if (theme === ThemeKey.light) {
      setTheme(ThemeKey.dark);
    } else {
      setTheme(ThemeKey.light);
    }
  }

  return <button onClick={handleThemeToggle}>Change theme</button>;
}
