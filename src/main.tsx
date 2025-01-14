import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('ServiceWorker registration successful:', registration.scope);
  }).catch((error) => {
    console.log('ServiceWorker registration failed:', error);
  });
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

createRoot(root).render(app);