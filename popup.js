document.addEventListener('DOMContentLoaded', function() {
  const counter = document.getElementById('counter');
  const statusText = document.getElementById('status-text');
  const sessionCount = document.getElementById('session-count');
  const totalCount = document.getElementById('total-count');
  const resetBtn = document.getElementById('reset-btn');
  
  let currentTab = null;
  let sessionBlocked = 0;
  
  // Get current tab information
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length === 0) return;
    
    currentTab = tabs[0];
    const isLocalhost = currentTab.url.includes('localhost');
    const isOdoo = currentTab.url.toLowerCase().includes('odoo') || 
                   currentTab.title.toLowerCase().includes('odoo');
    
    // Update status based on current tab
    if (isLocalhost) {
      statusText.textContent = '✅ Active on localhost';
      statusText.className = 'status-text status-active';
      
      if (isOdoo) {
        statusText.textContent = '✅ Active on Odoo (localhost)';
      }
    } else {
      statusText.textContent = '⚠️ Only works on localhost';
      statusText.className = 'status-text status-inactive';
    }
    
    resetBtn.disabled = !isLocalhost;
  });
  
  // Load stored counts from storage
  chrome.storage.local.get(['blockedCount', 'sessionCount'], function(result) {
    const totalBlocked = result.blockedCount || 0;
    sessionBlocked = result.sessionCount || 0;
    
    updateCounters(totalBlocked, sessionBlocked);
  });
  
  // Initialize session count for this popup opening
  chrome.storage.local.set({'sessionCount': 0});
  
  // Function to update all counters
  function updateCounters(total, session) {
    counter.textContent = total;
    sessionCount.textContent = session;
    totalCount.textContent = total;
    
    // Update counter styling
    if (total === 0) {
      counter.classList.add('counter-zero');
    } else {
      counter.classList.remove('counter-zero');
    }
  }
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'alertRemoved') {
      sessionBlocked += message.removedThisTime || 1;
      updateCounters(message.count, sessionBlocked);
      
      // Store session count
      chrome.storage.local.set({'sessionCount': sessionBlocked});
      
      // Animate the counter briefly
      counter.style.transform = 'scale(1.2)';
      counter.style.color = '#e74c3c';
      setTimeout(() => {
        counter.style.transform = 'scale(1)';
        counter.style.color = '#27ae60';
      }, 200);
    }
    
    sendResponse({received: true});
  });
  
  // Function to reset counter
  window.resetCounter = function() {
    chrome.storage.local.set({
      'blockedCount': 0,
      'sessionCount': 0
    }, function() {
      sessionBlocked = 0;
      updateCounters(0, 0);
      
      // Brief visual feedback
      resetBtn.textContent = 'Reset!';
      setTimeout(() => {
        resetBtn.textContent = 'Reset Counter';
      }, 1000);
    });
  };
  
  // Add some interactive feedback
  resetBtn.addEventListener('mouseenter', function() {
    if (!this.disabled) {
      this.textContent = 'Reset to 0';
    }
  });
  
  resetBtn.addEventListener('mouseleave', function() {
    if (!this.disabled) {
      this.textContent = 'Reset Counter';
    }
  });
  
  // Auto-refresh popup data every few seconds
  setInterval(function() {
    chrome.storage.local.get(['blockedCount', 'sessionCount'], function(result) {
      const totalBlocked = result.blockedCount || 0;
      const sessionBlocked = result.sessionCount || 0;
      
      updateCounters(totalBlocked, sessionBlocked);
    });
  }, 2000);
  
  // Handle popup closing/opening
  window.addEventListener('beforeunload', function() {
    // Reset session count when popup closes
    chrome.storage.local.set({'sessionCount': 0});
  });
});
