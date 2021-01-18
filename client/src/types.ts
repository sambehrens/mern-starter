// Must stay as number enum if keeping logic in ThemeProvider
// for storing saved theme.
export enum ThemeKey {
  light,
  dark,
}

export enum UserAccessLevel {
  user = 'User',
  admin = 'Admin',
}

export interface User {
  name: string;
  email: string;
  accessLevel: UserAccessLevel;
}
