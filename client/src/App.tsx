/**
 *
 */

import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import InsertRecipePopUp from './components/InsertRecipePopUp';
import HomePage from './components/HomePage';
import SavedRecipesScreen from './components/SavedRecipesScreen';
import { hot } from 'react-hot-loader';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/saved-recipes',
    element: <SavedRecipesScreen />
  }
]);

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

//const app: React.ComponentType = hot(module)(App);
