import { ThemeKey } from '../types';
import { DefaultTheme } from 'styled-components';

export type Theme = DefaultTheme;

export type ThemesType = {
  [P in ThemeKey]: Theme;
};

export const themes: ThemesType = {
  [ThemeKey.light]: {
    key: ThemeKey.light,
    backgroundColor: {
      main: 'white',
      secondary: 'lightgray',
    },
    textColor: {
      main: 'black',
      secondary: 'darkgray',
    },
  },
  [ThemeKey.dark]: {
    key: ThemeKey.dark,
    backgroundColor: {
      main: 'black',
      secondary: 'darkgray',
    },
    textColor: {
      main: 'white',
      secondary: 'lightgray',
    },
  },
};
