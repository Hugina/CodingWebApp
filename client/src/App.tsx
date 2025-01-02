/**
 *
 */

import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Navigation } from './components/Navigation';
import Button from './components/Button';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <div>
        <h1>React with TypeScript - 2</h1>
        <Navigation />
        <Button onClick= {() => console.log('Clicked')}>Nadav's Button</Button>
      </div>
    );
  }
}

const app: React.ComponentType = hot(module)(App);

export { app as App };
