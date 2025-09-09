// Odoo Alert Blocker - Content Script (Firefox Optimized)
// Automatically removes subscription alerts from Odoo on localhost

let blockedCount = 0;

// Load existing count from storage
browser.storage.local.get(['blockedCount']).then(function(result) {
  blockedCount = result.blockedCount || 0;
});

// Function to remove Odoo subscription alerts
function removeOdooAlerts() {
  let removedThisTime = 0;
  
  // Common selectors for Odoo subscription alerts
  const alertSelectors = [
    // Generic alert/warning selectors
    '.alert:contains("subscription")',
    '.alert:contains("upgrade")',
    '.alert:contains("trial")',
    '.warning:contains("subscription")',
    '.notification:contains("subscription")',
    
    // Specific Odoo selectors (these may need to be updated based on Odoo version)
    '.o_dialog_warning:contains("subscription")',
    '.o_notification:contains("subscription")',
    '.o_notification:contains("upgrade")',
    '.modal:contains("subscription")',
    '.modal:contains("upgrade")',
    
    // Bootstrap alert classes commonly used in Odoo
    '.alert-warning:contains("subscription")',
    '.alert-info:contains("upgrade")',
    '.alert-danger:contains("trial")',
    
    // Custom alert patterns that might contain subscription warnings
    '[class*="alert"]:contains("subscription")',
    '[class*="warning"]:contains("subscription")',
    '[class*="notification"]:contains("subscription")'
  ];
  
  // Function to check if element contains subscription-related text
  function containsSubscriptionText(element) {
    const text = element.textContent.toLowerCase();
    const keywords = [
      'subscription',
      'upgrade',
      'trial',
      'enterprise',
      'license',
      'expired',
      'renew',
      'billing',
      'payment',
      'plan'
    ];
    
    return keywords.some(keyword => text.includes(keyword));
  }
  
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
  
  // Remove alerts using CSS selectors with :contains pseudo-selector workaround
  alertSelectors.forEach(selector => {
    // Since :contains is not available in querySelector, we'll search manually
    const baseSelector = selector.split(':contains')[0];
    const elements = document.querySelectorAll(baseSelector);
    
    elements.forEach(element => {
      if (containsSubscriptionText(element)) {
        // Check if parent div has blocking overlay styles
        const parent = element.parentElement;
        if (parent && hasBlockingOverlayStyles(parent)) {
          parent.remove();
          removedThisTime++;
          console.log('🛡️ Blocked Odoo subscription alert with blocking parent overlay');
        } else {
          element.remove();
          removedThisTime++;
          console.log('🛡️ Blocked Odoo subscription alert:', element.textContent.trim().substring(0, 100));
        }
      }
    });
  });
  
  // Also check for modal dialogs and overlays
  const modals = document.querySelectorAll('.modal, .o_dialog, [class*="dialog"]');
  modals.forEach(modal => {
    if (containsSubscriptionText(modal)) {
      modal.remove();
      removedThisTime++;
      console.log('🛡️ Blocked Odoo subscription modal');
    }
  });
  
  // Check for any elements with specific subscription-related attributes
  const elementsWithDataAttrs = document.querySelectorAll('[data-original-title*="subscription"], [title*="subscription"], [aria-label*="subscription"]');
  elementsWithDataAttrs.forEach(element => {
    element.remove();
    removedThisTime++;
    console.log('🛡️ Blocked Odoo subscription element with data attributes');
  });
  
  // Update counter if any alerts were removed
  if (removedThisTime > 0) {
    blockedCount += removedThisTime;
    
    // Store updated count
    browser.storage.local.set({blockedCount: blockedCount});
    
    // Notify popup of the update
    try {
      browser.runtime.sendMessage({
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
  
  console.log('🛡️ Odoo Alert Blocker (Firefox): Initialized on', window.location.hostname);
  
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