/**
 *
 */

import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Navigation } from './components/Navigation';
import Button from './components/Button';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Alert from './components/Alert';
import { useState } from 'react';
import RecipeScreen from './components/RecipeScreen';

const App = () => {
  return (
    <div>
      <RecipeScreen />
    </div>
  );
};

// const app: React.ComponentType = hot(module)(App);

export default App;
