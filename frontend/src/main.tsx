import ReactDOM from 'react-dom/client';
import Home from './pages/Home.tsx';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Game from './pages/Game.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/game/:id',
    element: <Game />,
  },
  {
    // This route will catch all other paths
    path: '*',
    element: <Navigate to='/' replace />,
  },
]);

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
