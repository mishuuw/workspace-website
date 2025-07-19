import { lazy, Suspense } from 'react';
const Home = lazy(() => import('../features/index/pages/Home.jsx'));
const Register = lazy(() => import('../features/auth/pages/Register.jsx'));
const Login = lazy(() => import('../features/auth/pages/Login.jsx'));

export const publicRoutes = [
  {
    path: '/',
    element: (
      <Suspense fallback="Loading...">
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback="Loading...">
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback="Loading...">
        <Login />
      </Suspense>
    ),
  },
];

export const privateRoutes = [

];