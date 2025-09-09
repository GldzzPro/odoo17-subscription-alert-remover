# Odoo Alert Blocker - Chrome Extension

This is the Chrome-optimized version of the Odoo Alert Blocker extension, built with Manifest V3.

## Features

- Automatically removes Odoo subscription alerts on localhost
- Real-time monitoring with DOM observer
- Counter tracking for blocked alerts
- Modern Chrome Manifest V3 compliance
- Optimized for Chrome's extension APIs

## Installation

### Method 1: Developer Mode (Recommended)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select this `chrome-extension` folder
5. The extension will be installed and ready to use

### Method 2: Chrome Web Store

*This extension is not currently published on the Chrome Web Store*

## Usage

1. Navigate to your Odoo instance on localhost (e.g., `http://localhost:8069`)
2. The extension will automatically start blocking subscription alerts
3. Click the extension icon to view the popup with:
   - Current blocked alert count
   - Extension status
   - Reset counter button
   - Refresh page button

## Technical Details

- **Manifest Version**: 3 (Chrome's latest standard)
- **Permissions**: `storage`, `activeTab`
- **Host Permissions**: `http://localhost/*`, `https://localhost/*`
- **APIs Used**: Chrome Extensions API (chrome.storage, chrome.tabs, chrome.runtime)

## Files Structure

```
chrome-extension/
├── manifest.json     # Chrome Manifest V3 configuration
├── content.js        # Content script with Chrome APIs
├── popup.js          # Popup script with Chrome APIs
├── popup.html        # Extension popup interface
├── icon16.png        # 16x16 icon
├── icon48.png        # 48x48 icon
├── icon128.png       # 128x128 icon
├── icon.svg          # Vector icon
└── README.md         # This file
```

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Chromium-based browsers (Edge, Brave, etc.)
- ❌ Firefox (use the firefox-extension folder instead)

## Troubleshooting

### Extension not working?
1. Make sure you're on a localhost URL
2. Check that the extension is enabled in `chrome://extensions/`
3. Refresh the page after installing the extension
4. Check the browser console for any error messages

### No alerts being blocked?
1. Verify you're on an Odoo instance with subscription alerts
2. The extension only works on localhost domains
3. Try refreshing the page to trigger the content script

## Development

This extension uses Chrome's native APIs without any compatibility wrappers for optimal performance:

- `chrome.storage.local` for persistent data storage
- `chrome.tabs` for tab management
- `chrome.runtime` for message passing
- Standard DOM APIs for alert detection and removal

## Version

**v1.0.0** - Chrome Manifest V3 optimized version