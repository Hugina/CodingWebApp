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

class App extends React.Component {
  public render(): React.ReactNode {
    const [alertVisible, setAlertVisibility] = useState(false)
    return (
      <div>
        {alertVisible && <Alert>My Alert</Alert>}
        <h1>React with TypeScript - 2</h1>
        <Navigation />
        <Button onClick= {() => setAlertVisibility(true)}>Nadav's Button</Button>
      </div>
    );
  }
}

const app: React.ComponentType = hot(module)(App);

export { app as App };
