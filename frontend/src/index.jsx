import React, { StrictMode, useContext, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './features/auth/authProvider';
import { AuthContext } from './features/auth/authContext';
import './index.css';
import { setupAxiosInterceptors } from './features/auth/axiosInstance';
import RouterApp from './app/router.jsx';

const AppWithAxios = () => {
  const { updateAccessToken, logout, isLoading } = useContext(AuthContext);

  useEffect(() => {
    setupAxiosInterceptors(updateAccessToken, logout);
  }, [updateAccessToken, logout]);

    // TODO: make loading screen
  if (isLoading) return <div> Loading ... </div>

  return <RouterApp />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppWithAxios />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);