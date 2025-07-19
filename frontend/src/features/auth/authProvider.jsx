import { useState, useCallback, useEffect } from 'react';
import * as authService from './authService';
import { AuthContext } from './authContext';
import { useAuth } from './useAuth';

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setAccessToken(data.accessToken);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      // await authService.logout(); Если бек потребует можно вернуть
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Автологин при старте
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const newToken = await authService.refreshToken();
        if (isMounted) {
          setAccessToken(newToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Неавторизован — оставляем isAuthenticated = false
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = {
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};