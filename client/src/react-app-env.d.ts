/// <reference types="react-scripts" />
import { ThemeKey, UserAccessLevel } from './types';
import { JwtDecodeOptions } from 'jwt-decode';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    key: ThemeKey;

    backgroundColor: {
      main: string;
      secondary: string;
    };

    textColor: {
      main: string;
      secondary: string;
    };
  }
}

declare module 'jwt-decode' {
  export default function jwtDecode(token: string, options?: JwtDecodeOptions): { userId?: string; exp: number };
}
