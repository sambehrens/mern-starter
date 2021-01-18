import * as React from 'react';
import { loginUser, LoginUserParams, refreshAuthToken, setAuthToken } from '../api/auth';
import jwtDecode from 'jwt-decode';
import { User } from '../types';
import { getUser } from '../api/users';

interface IAuthContext {
  logout: () => void;
  login: (params: LoginUserParams) => Promise<any>;
  refreshToken: () => void;
  userId?: string;
  loggedInUser?: User;
}

const AuthContext = React.createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = React.useState<string>();
  const [loggedInUser, setLoggedInUser] = React.useState<User>();

  /**
   * Find existing refresh token and verify it.
   */
  React.useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      setAuthToken(token);

      const decoded = jwtDecode(token);

      setUserId(decoded.userId);

      // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds

      if (decoded.exp < currentTime) {
        logout();
      } else {
        refreshToken();
      }
    }
  }, []);

  /**
   * Handle refreshing auth token.
   */
  React.useEffect(() => {
    let shouldRefresh = false;

    const jwtRefresh = () => {
      if (localStorage.getItem('jwtToken')) {
        refreshToken();
      }
    };

    const logoutUser = () => {
      if (localStorage.getItem('jwtToken') && !shouldRefresh) {
        logout();
      }
    };

    let logoutInterval: number;
    const hours = 3600000; // 1 hour in milliseconds

    const resetLogoutInterval = () => {
      clearInterval(logoutInterval);
      logoutInterval = setInterval(logoutUser, 10 * hours);
    };

    resetLogoutInterval();

    const logoutRefresh = () => {
      if (shouldRefresh) {
        shouldRefresh = false;
        resetLogoutInterval();
      }
    };

    setInterval(jwtRefresh, 2 * hours);
    setInterval(logoutRefresh, 5 * hours);

    const interact = () => {
      if (!shouldRefresh) {
        shouldRefresh = true;
      }
    };

    window.onmousemove = interact;
    window.onmousedown = interact;
  }, []);

  React.useEffect(() => {
    if (userId) {
      getUser(userId)
        .then((response) => setLoggedInUser(response.data))
        .catch((error) => console.log(error));
    }
  }, [userId]);

  function logout() {
    localStorage.removeItem('jwtToken');
    setAuthToken();
    setUserId(undefined);
    setLoggedInUser(undefined);
  }

  function login(params: LoginUserParams) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          data: { token },
        } = await loginUser(params);

        localStorage.setItem('jwtToken', token);

        setAuthToken(token);

        const decoded = jwtDecode(token);

        setUserId(decoded.userId);

        resolve();
      } catch (error) {
        console.log('Error logging in', error);

        reject(error);
      }
    });
  }

  async function refreshToken() {
    try {
      const {
        data: { token },
      } = await refreshAuthToken();

      localStorage.setItem('jwtToken', token);

      setAuthToken(token);
    } catch (error) {
      logout();
    }
  }

  return (
    <AuthContext.Provider value={{ login, logout, refreshToken, userId, loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('Cannot use useAuth outside of an AuthProvider');
  }

  return context;
}
