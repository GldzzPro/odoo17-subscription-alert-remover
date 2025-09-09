# Odoo Alert Blocker

A cross-browser extension that automatically removes subscription alerts from Odoo on localhost.

## Features

- Automatically detects and removes Odoo subscription alerts
- Works on localhost environments
- Real-time blocking with DOM observation
- Counter tracking for blocked alerts
- Cross-browser compatible (Chrome & Firefox)

## Installation

### Chrome Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `odoo-alert-blocker` folder
5. The extension should now appear in your extensions list

### Firefox Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the `odoo-alert-blocker` folder and select `manifest.json`
5. The extension should now appear in your temporary extensions list

**Note for Firefox:** The extension will be removed when Firefox is restarted. For permanent installation, you would need to sign the extension through Mozilla's Add-on Developer Hub.

## Usage

1. Navigate to your Odoo instance running on localhost
2. The extension will automatically start blocking subscription alerts
3. Click the extension icon to view statistics:
   - Total alerts blocked
   - Session alerts blocked
   - Reset counter option

## Supported Alert Types

The extension blocks alerts containing these keywords:
- subscription
- upgrade
- trial
- enterprise
- license
- expired
- renew
- billing
- payment
- plan

## Technical Details

- **Manifest Version:** 2 (compatible with both Chrome and Firefox)
- **Permissions:** Storage, Active Tab, Localhost access
- **Content Script:** Runs on localhost pages only
- **Cross-browser API:** Uses WebExtensions standard with fallbacks

## Browser Compatibility

- ✅ Chrome (Manifest V2 & V3 compatible)
- ✅ Firefox (WebExtensions)
- ✅ Edge (Chromium-based)
- ✅ Opera (Chromium-based)

## Development

The extension uses a cross-browser compatibility layer that automatically detects the available API:

```javascript
const browserAPI = (function() {
  if (typeof browser !== 'undefined') {
    return browser; // Firefox
  } else if (typeof chrome !== 'undefined') {
    return chrome; // Chrome
  }
  throw new Error('Browser API not available');
})();
```

## Files Structure

```
odoo-alert-blocker/
├── manifest.json       # Extension manifest (Manifest V2)
├── content.js         # Content script for alert blocking
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality
├── icon16.png        # 16x16 icon
├── icon48.png        # 48x48 icon
├── icon128.png       # 128x128 icon
├── icon.svg          # Vector icon
└── README.md         # This file
```

## License

This extension is provided as-is for development purposes.