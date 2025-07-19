import { Routes, Route } from 'react-router'
import { useAuth } from '../features/auth/useAuth.jsx';
import { publicRoutes, privateRoutes } from './routesConfig.jsx';
import NotFound from '../shared/components/notFound.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function RouterApp() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Публичные маршруты */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Приватные маршруты */}
      {isAuthenticated &&
        privateRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}

export default RouterApp
