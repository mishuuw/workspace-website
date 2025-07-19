import { useState, useCallback, useEffect } from 'react';
import * as authService from './authService.jsx';
import { AuthContext } from './authContext.jsx';

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
      await authService.logout();
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  const relog = useCallback(async () => {
    setIsLoading(true);
    try {
      const newToken = await authService.refreshToken();
      setAccessToken(newToken);
      setIsAuthenticated(true);
      return newToken;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Автологин при старте
  useEffect(() => relog, []);

  const value = {
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    relog
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};