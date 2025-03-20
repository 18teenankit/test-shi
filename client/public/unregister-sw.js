// Unregister service workers script
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister().then(function(success) {
        console.log('Service worker unregistered successfully:', success);
        if (success) {
          // Clear all caches
          caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                console.log('Deleting cache:', cacheName);
                return caches.delete(cacheName);
              })
            );
          }).then(function() {
            console.log('All caches cleared');
            // Force reload without cache
            window.location.reload(true);
          });
        }
      });
    }
  });
} 