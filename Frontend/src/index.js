import React from 'react';
import ReactDOM from 'react-dom/client'; // Change this import
import { BrowserRouter } from 'react-router-dom';
import App from './components/App'; // Import the main App component
import './index.css'; // Import global CSS styles

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in BrowserRouter for routing
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
