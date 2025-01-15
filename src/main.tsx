import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker with improved error handling and logging
if ("serviceWorker" in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful:",
          registration.scope
        );

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show refresh prompt if needed
                console.log('New content is available; please refresh.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  });

  // Handle offline/online events
  window.addEventListener('online', () => {
    console.log('Application is online');
  });

  window.addEventListener('offline', () => {
    console.log('Application is offline');
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);