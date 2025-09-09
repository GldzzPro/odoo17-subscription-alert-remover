# Odoo Alert Blocker - Firefox Extension

This is the Firefox-optimized version of the Odoo Alert Blocker extension, built with Manifest V2 and WebExtensions API.

## Features

- Automatically removes Odoo subscription alerts on localhost
- Real-time monitoring with DOM observer
- Counter tracking for blocked alerts
- Firefox Manifest V2 compliance
- Optimized for Firefox's WebExtensions APIs

## Installation

### Method 1: Temporary Installation (Development)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this `firefox-extension` folder
5. The extension will be installed temporarily (until Firefox restart)

### Method 2: Permanent Installation (Signed)

1. Package the extension as a .xpi file
2. Submit to Mozilla Add-ons for signing
3. Install the signed .xpi file

*Note: Firefox requires extensions to be signed for permanent installation*

### Method 3: Developer Edition/Nightly (Unsigned)

1. Use Firefox Developer Edition or Nightly
2. Set `xpinstall.signatures.required` to `false` in `about:config`
3. Package as .xpi and install directly

## Usage

1. Navigate to your Odoo instance on localhost (e.g., `http://localhost:8069`)
2. The extension will automatically start blocking subscription alerts
3. Click the extension icon to view the popup with:
   - Current blocked alert count
   - Extension status
   - Reset counter button
   - Refresh page button

## Technical Details

- **Manifest Version**: 2 (Firefox's stable standard)
- **Permissions**: `storage`, `activeTab`, `http://localhost/*`, `https://localhost/*`
- **APIs Used**: WebExtensions API (browser.storage, browser.tabs, browser.runtime)
- **Firefox ID**: `odoo-alert-blocker@extension.local`
- **Minimum Firefox Version**: 57.0

## Files Structure

```
firefox-extension/
├── manifest.json     # Firefox Manifest V2 configuration
├── content.js        # Content script with WebExtensions APIs
├── popup.js          # Popup script with WebExtensions APIs
├── popup.html        # Extension popup interface
├── icon16.png        # 16x16 icon
├── icon48.png        # 48x48 icon
├── icon128.png       # 128x128 icon
├── icon.svg          # Vector icon
└── README.md         # This file
```

## Browser Compatibility

- ✅ Firefox 57+
- ✅ Firefox ESR
- ✅ Firefox Developer Edition
- ✅ Firefox Nightly
- ❌ Chrome (use the chrome-extension folder instead)

## Troubleshooting

### Extension not working?
1. Make sure you're on a localhost URL
2. Check that the extension is enabled in `about:addons`
3. Refresh the page after installing the extension
4. Check the browser console for any error messages

### Temporary installation disappeared?
1. Temporary installations are removed when Firefox restarts
2. Reload the extension from `about:debugging`
3. For permanent installation, the extension needs to be signed by Mozilla

### No alerts being blocked?
1. Verify you're on an Odoo instance with subscription alerts
2. The extension only works on localhost domains
3. Try refreshing the page to trigger the content script

## Development

This extension uses Firefox's WebExtensions API with promises for modern JavaScript patterns:

- `browser.storage.local` with Promise-based API
- `browser.tabs` for tab management
- `browser.runtime` for message passing
- Standard DOM APIs for alert detection and removal

## Packaging for Distribution

To create a .xpi file for distribution:

```bash
cd firefox-extension
zip -r ../odoo-alert-blocker-firefox.xpi *
```

## Version

**v1.0.0** - Firefox Manifest V2 optimized version