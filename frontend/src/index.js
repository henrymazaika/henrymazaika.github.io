import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// This is the root where your React application will be rendered.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
