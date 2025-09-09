// Odoo Alert Blocker - Popup Script (Safari Optimized)
// Popup interface for the Safari extension

document.addEventListener('DOMContentLoaded', function() {
  const counterElement = document.getElementById('counter');
  const statusElement = document.getElementById('status');
  const resetButton = document.getElementById('resetButton');
  const refreshButton = document.getElementById('refreshButton');
  
  // Safari Web Extension compatibility check
  const isSafariWebExtension = typeof browser !== 'undefined' && browser.tabs;
  
  // Check if we're on localhost
  function checkCurrentTab() {
    if (isSafariWebExtension) {
      browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
        const currentTab = tabs[0];
        const isLocalhost = currentTab.url.includes('localhost');
        
        updateStatus(isLocalhost);
      }).catch(function(error) {
        console.log('🛡️ Safari tabs query error:', error);
        updateStatus(false);
      });
    } else {
      // Fallback for older Safari versions - assume localhost if we can't check
      updateStatus(true);
    }
  }
  
  function updateStatus(isLocalhost) {
    if (isLocalhost) {
      statusElement.textContent = '✅ Active on localhost';
      statusElement.className = 'status active';
    } else {
      statusElement.textContent = '⚠️ Only works on localhost';
      statusElement.className = 'status inactive';
    }
  }
  
  // Load and display current count
  function updateCounter() {
    if (isSafariWebExtension) {
      browser.storage.local.get(['blockedCount']).then(function(result) {
        const count = result.blockedCount || 0;
        displayCounter(count);
      }).catch(function(error) {
        console.log('🛡️ Safari storage get error:', error);
        // Fallback to localStorage
        const count = parseInt(localStorage.getItem('odoo-alert-blocker-count') || '0');
        displayCounter(count);
      });
    } else {
      // Fallback for older Safari versions
      const count = parseInt(localStorage.getItem('odoo-alert-blocker-count') || '0');
      displayCounter(count);
    }
  }
  
  function displayCounter(count) {
    counterElement.textContent = count;
    
    // Add visual feedback for count changes
    counterElement.classList.add('updated');
    setTimeout(() => {
      counterElement.classList.remove('updated');
    }, 300);
  }
  
  // Initial setup
  checkCurrentTab();
  updateCounter();
  
  // Listen for messages from content script
  if (isSafariWebExtension) {
    browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'alertRemoved') {
        updateCounter();
        showNotification(message.removedThisTime);
      }
    });
  } else {
    // Fallback for older Safari versions - listen for custom events
    document.addEventListener('odooAlertBlocked', function(event) {
      if (event.detail.action === 'alertRemoved') {
        updateCounter();
        showNotification(event.detail.removedThisTime);
      }
    });
  }
  
  function showNotification(removedCount) {
    // Show brief notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `Blocked ${removedCount} alert(s)!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
  
  // Reset counter functionality
  resetButton.addEventListener('click', function() {
    if (isSafariWebExtension) {
      browser.storage.local.set({blockedCount: 0}).then(function() {
        updateCounter();
        showResetFeedback();
      }).catch(function(error) {
        console.log('🛡️ Safari storage set error:', error);
        // Fallback to localStorage
        localStorage.setItem('odoo-alert-blocker-count', '0');
        updateCounter();
        showResetFeedback();
      });
    } else {
      // Fallback for older Safari versions
      localStorage.setItem('odoo-alert-blocker-count', '0');
      updateCounter();
      showResetFeedback();
    }
  });
  
  function showResetFeedback() {
    // Visual feedback
    resetButton.textContent = 'Reset ✓';
    resetButton.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
      resetButton.textContent = 'Reset Counter';
      resetButton.style.backgroundColor = '';
    }, 1000);
  }
  
  // Refresh page functionality
  refreshButton.addEventListener('click', function() {
    if (isSafariWebExtension) {
      browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
        browser.tabs.reload(tabs[0].id).then(function() {
          showRefreshFeedback();
        }).catch(function(error) {
          console.log('🛡️ Safari tabs reload error:', error);
          showRefreshFeedback();
        });
      }).catch(function(error) {
        console.log('🛡️ Safari tabs query error:', error);
        showRefreshFeedback();
      });
    } else {
      // Fallback for older Safari versions - just show feedback
      showRefreshFeedback();
      alert('Please refresh the page manually');
    }
  });
  
  function showRefreshFeedback() {
    // Visual feedback
    refreshButton.textContent = 'Refreshed ✓';
    refreshButton.style.backgroundColor = '#17a2b8';
    
    setTimeout(() => {
      refreshButton.textContent = 'Refresh Page';
      refreshButton.style.backgroundColor = '';
    }, 1000);
    
    // Close popup after refresh
    setTimeout(() => {
      window.close();
    }, 500);
  }
  
  // Auto-refresh counter every 2 seconds
  setInterval(updateCounter, 2000);
  
  // Close popup when clicking outside (if supported)
  document.addEventListener('click', function(event) {
    if (event.target === document.body) {
      window.close();
    }
  });
});

// Add CSS for counter animation
const style = document.createElement('style');
style.textContent = `
  .counter.updated {
    transform: scale(1.1);
    color: #28a745;
    transition: all 0.3s ease;
  }
  
  .notification {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #28a745;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  /* Safari-specific styles */
  body {
    -webkit-user-select: none;
    user-select: none;
  }
  
  button {
    -webkit-appearance: none;
    appearance: none;
  }
`;
document.head.appendChild(style);