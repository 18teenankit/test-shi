import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Only handle service worker in production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister().then(function(success) {
          console.log('Service worker unregistered successfully:', success);
        });
      }
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
