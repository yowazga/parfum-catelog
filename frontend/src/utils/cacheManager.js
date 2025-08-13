// Cache Management Utility for AromaLuxe

/**
 * Clear all browser caches and force fresh content
 */
export const clearAllCaches = async () => {
  try {
    console.log('Starting cache clearing process...');
    
    // Clear service worker cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('Clearing service worker cache...');
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.log('Service worker cache clear timeout, using fallback');
          fallbackCacheClear().then(resolve);
        }, 3000); // 3 second timeout
        
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timeout);
          if (event.data.type === 'CACHE_CLEARED') {
            console.log('Service Worker cache cleared');
            resolve();
          }
        };
        
        try {
          navigator.serviceWorker.controller.postMessage(
            { type: 'CLEAR_CACHE' },
            [messageChannel.port2]
          );
        } catch (error) {
          console.log('Service worker message failed, using fallback');
          clearTimeout(timeout);
          fallbackCacheClear().then(resolve);
        }
      });
    } else {
      console.log('No service worker controller, using fallback');
      await fallbackCacheClear();
    }
    
  } catch (error) {
    console.error('Error clearing caches:', error);
    // Fallback: force reload
    window.location.reload(true);
  }
};

/**
 * Fallback cache clearing method
 */
const fallbackCacheClear = async () => {
  try {
    // Clear caches manually
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      console.log('Manual cache clearing completed');
    }
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('Local storage cleared');
    
    // Force page reload
    window.location.reload(true);
    
  } catch (error) {
    console.error('Fallback cache clearing failed:', error);
    // Last resort: force reload
    window.location.reload(true);
  }
};

/**
 * Force refresh of specific data types
 */
export const forceRefresh = {
  // Force refresh images
  images: () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src) {
        const separator = img.src.includes('?') ? '&' : '?';
        img.src = `${img.src}${separator}_t=${Date.now()}`;
      }
    });
  },
  
  // Force refresh API data
  apiData: () => {
    // Dispatch custom event to trigger data refresh
    window.dispatchEvent(new CustomEvent('forceDataRefresh'));
  },
  
  // Force refresh everything
  all: () => {
    clearAllCaches();
  }
};

/**
 * Check if app needs update
 */
export const checkForUpdates = async () => {
  try {
    const response = await fetch('/sw.js', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const newHash = await response.text();
      const currentHash = localStorage.getItem('appHash');
      
      if (newHash !== currentHash) {
        localStorage.setItem('appHash', newHash);
        return true; // Update available
      }
    }
    
    return false; // No update
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
};

/**
 * Auto-refresh on app updates
 */
export const enableAutoRefresh = () => {
  // Check for updates every 5 minutes
  setInterval(async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate) {
      console.log('App update detected, refreshing...');
      clearAllCaches();
    }
  }, 5 * 60 * 1000);
  
  // Also check on focus (when user returns to tab)
  window.addEventListener('focus', async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate) {
      console.log('App update detected on focus, refreshing...');
      clearAllCaches();
    }
  });
};
