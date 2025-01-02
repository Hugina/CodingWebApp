/**
 *
 */

import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Navigation } from './components/Navigation';
import Button from './components/Button';
import 'bootstrap/dist/css/bootstrap.css';
import Alert from './components/Alert';
import { useState } from 'react'


const App = () => {
  const [alertVisible, setAlertVisibility] = useState(false)
  console.log("APP: alertVisible is: ", alertVisible)
  return (
    <div>
      <h1>Welcome to RecipEasy!</h1>
    </div>
  );
}


// const app: React.ComponentType = hot(module)(App);

export default App;
