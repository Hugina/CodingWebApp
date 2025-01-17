import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import HomePage from './components/HomePage';
import SavedRecipesScreen from './components/SavedRecipesScreen';
import CodeBlockPage from './components/CodeBlockPage';
import NotFoundPage from './components/NotFoundPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saved-recipes" element={<SavedRecipesScreen />} />
        <Route path="/code-block/:id" element={<CodeBlockPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
