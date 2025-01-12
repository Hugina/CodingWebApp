import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <a href="/">Go to Home</a>
    </div>
  );
};

export default NotFoundPage;
