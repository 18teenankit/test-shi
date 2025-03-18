import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use setTimeout to delay registration until after critical operations
    setTimeout(() => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          // Service worker registered successfully
        })
        .catch(error => {
          // Service worker registration failed - log but don't disrupt the app
          console.error('Service worker registration failed:', error);
        });
    }, 1000); // Delay by 1 second
  });
}

createRoot(document.getElementById("root")!).render(<App />);
