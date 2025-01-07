/**
 *
 */

import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import InsertRecipePopUp from './components/InsertRecipePopUp';
import HomePage from './components/HomePage';

const App = () => {
  const router = createBrowserRouter([]);
  return (
    <RouterProvider router={router}>
      <>
        <HomePage />
      </>
    </RouterProvider>
  );
};

//const app: React.ComponentType = hot(module)(App);

export default App;
