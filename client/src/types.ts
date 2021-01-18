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
