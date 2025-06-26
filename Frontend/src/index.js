import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App'; // Import the main App component
import './index.css'; // Import global CSS styles

// Render the App component wrapped in BrowserRouter for routing
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') // Render into the root div in index.html
);
