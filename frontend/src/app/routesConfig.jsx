import Home from '../features/index/pages/Home';
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'

export const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login />}
];

export const privateRoutes = [

];