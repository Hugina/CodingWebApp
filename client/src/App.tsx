import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import HomePage from './components/HomePage';
import SavedRecipesScreen from './components/SavedRecipesScreen';
import CodeBlockPage from './components/CodeBlockPage';
import NotFoundPage from './components/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/saved-recipes',
    element: <SavedRecipesScreen />
  },
  {
    path: '/code-block/:id',
    element: <CodeBlockPage />
  },
  {
    path: '*', // catch-all route
    element: <NotFoundPage />
  }
]);

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
