// Odoo Alert Blocker - Popup Script (Chrome Optimized)
// Popup interface for the Chrome extension

document.addEventListener('DOMContentLoaded', function() {
  const counterElement = document.getElementById('counter');
  const statusElement = document.getElementById('status');
  const resetButton = document.getElementById('resetButton');
  const refreshButton = document.getElementById('refreshButton');
  
  // Check if we're on localhost
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const isLocalhost = currentTab.url.includes('localhost');
    
    if (isLocalhost) {
      statusElement.textContent = '✅ Active on localhost';
      statusElement.className = 'status active';
    } else {
      statusElement.textContent = '⚠️ Only works on localhost';
      statusElement.className = 'status inactive';
    }
  });
  
  // Load and display current count
  function updateCounter() {
    chrome.storage.local.get(['blockedCount'], function(result) {
      const count = result.blockedCount || 0;
      counterElement.textContent = count;
      
      // Add visual feedback for count changes
      counterElement.classList.add('updated');
      setTimeout(() => {
        counterElement.classList.remove('updated');
      }, 300);
    });
  }
  
  // Initial counter update
  updateCounter();
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'alertRemoved') {
      updateCounter();
      
      // Show brief notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = `Blocked ${message.removedThisTime} alert(s)!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  });
  
  // Reset counter functionality
  resetButton.addEventListener('click', function() {
    chrome.storage.local.set({blockedCount: 0}, function() {
      updateCounter();
      
      // Visual feedback
      resetButton.textContent = 'Reset ✓';
      resetButton.style.backgroundColor = '#28a745';
      
      setTimeout(() => {
        resetButton.textContent = 'Reset Counter';
        resetButton.style.backgroundColor = '';
      }, 1000);
    });
  });
  
  // Refresh page functionality
  refreshButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
      
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
    });
  });
  
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
`;
document.head.appendChild(style);