import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './features/auth/authProvider.jsx';
import { AuthContext } from './features/auth/authContext.jsx';
import './index.css';
import { setupAxiosInterceptors } from './features/auth/axiosInstance.jsx';
import RouterApp from './app/router.jsx';
import { useAuth } from './features/auth/useAuth.jsx';

const AppWithAxios = () => {
  const { accessToken, logout, isLoading, relog} = useAuth();
  
  useEffect(() => {
    const getAccessToken = () => accessToken; 
    setupAxiosInterceptors(relog, logout, getAccessToken);
  }, [relog, logout, accessToken]);

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