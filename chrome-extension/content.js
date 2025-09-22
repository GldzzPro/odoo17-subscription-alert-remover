// Odoo Alert Blocker - Content Script (Chrome Optimized)
// Automatically removes subscription alerts from Odoo on localhost

let blockedCount = 0;

// Load existing count from storage
chrome.storage.local.get(['blockedCount'], function(result) {
  blockedCount = result.blockedCount || 0;
});

// Function to remove Odoo blocking overlays
function removeOdooAlerts() {
  let removedThisTime = 0;
  
  // Function to check if element has blocking overlay styles
  function hasBlockingOverlayStyles(element) {
    const style = window.getComputedStyle(element);
    return style.position === 'absolute' &&
           style.top === '0px' &&
           style.left === '0px' &&
           style.right === '0px' &&
           style.bottom === '0px' &&
           style.zIndex === '1100';
  }
  
  // Function to check if element has modal/dialog blocking characteristics
  function hasModalBlockingStyles(element) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Check for modal-like positioning and high z-index
    return (style.position === 'fixed' || style.position === 'absolute') &&
           parseInt(style.zIndex) >= 1000 &&
           rect.width > 200 && rect.height > 100; // Reasonable modal size
  }
  
  // Function to check if element contains database_expiration_panel
  function containsDatabaseExpirationPanel(element) {
    return element.querySelector('.database_expiration_panel') !== null;
  }
  
  // Scan all elements for blocking overlay styles that contain database_expiration_panel
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    if (hasBlockingOverlayStyles(element) && containsDatabaseExpirationPanel(element)) {
      element.remove();
      removedThisTime++;
      console.log('🛡️ Blocked element with blocking overlay styles containing database_expiration_panel');
    } else if (hasModalBlockingStyles(element) && containsDatabaseExpirationPanel(element)) {
      // Additional check for modal-like elements that might be blocking
      const hasCloseButton = element.querySelector('[class*="close"], [class*="dismiss"], .btn-close, .fa-times, .fa-close');
      const hasModalClasses = element.classList.contains('modal') || 
                             element.classList.contains('dialog') ||
                             element.classList.contains('o_dialog') ||
                             element.classList.contains('popup');
      
      if (hasCloseButton || hasModalClasses) {
        element.remove();
        removedThisTime++;
        console.log('🛡️ Blocked modal-like blocking element containing database_expiration_panel');
      }
    }
  });
  
  // Update counter if any alerts were removed
  if (removedThisTime > 0) {
    blockedCount += removedThisTime;
    
    // Store updated count
    chrome.storage.local.set({blockedCount: blockedCount});
    
    // Notify popup of the update
    try {
      chrome.runtime.sendMessage({
        action: 'alertRemoved',
        count: blockedCount,
        removedThisTime: removedThisTime
      });
    } catch (error) {
      // Ignore errors if popup is not open
      console.log('🛡️ Popup not available for message');
    }
    
    console.log(`🛡️ Odoo Alert Blocker: Removed ${removedThisTime} alerts (Total: ${blockedCount})`);
  }
}

// Function to observe DOM changes
function observeDOM() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any new nodes are alerts
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check the node itself
            if (node.classList && (
              node.classList.contains('alert') || 
              node.classList.contains('notification') ||
              node.classList.contains('modal') ||
              node.classList.contains('o_dialog')
            )) {
              setTimeout(removeOdooAlerts, 100); // Small delay to ensure DOM is ready
            }
            
            // Check children of the node
            const alertElements = node.querySelectorAll('.alert, .notification, .modal, .o_dialog, [class*="warning"]');
            if (alertElements.length > 0) {
              setTimeout(removeOdooAlerts, 100);
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Initialize the extension
function initialize() {
  // Only run on localhost
  if (!window.location.hostname.includes('localhost')) {
    return;
  }
  
  console.log('🛡️ Odoo Alert Blocker (Chrome): Initialized on', window.location.hostname);
  
  // Initial scan for alerts
  removeOdooAlerts();
  
  // Set up DOM observer for dynamically added alerts
  observeDOM();
  
  // Periodic scan every 5 seconds as backup
  setInterval(removeOdooAlerts, 5000);
  
  // Also scan when page becomes visible (user switches back to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(removeOdooAlerts, 500);
    }
  });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}