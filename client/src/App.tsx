import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import HomePage from './components/HomePage';
import CodeBlockPage from './components/CodeBlockPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code-block/:id" element={<CodeBlockPage />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
