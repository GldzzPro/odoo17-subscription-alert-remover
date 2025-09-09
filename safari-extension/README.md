# Odoo Alert Blocker - Safari Extension

This is the Safari-optimized version of the Odoo Alert Blocker extension, built with Safari Web Extensions and WebKit APIs.

## Features

- Automatically removes Odoo subscription alerts on localhost
- Real-time monitoring with DOM observer
- Counter tracking for blocked alerts
- Safari Web Extension compliance
- Optimized for Safari's WebKit APIs with fallbacks
- Compatible with both modern Safari and legacy versions

## Installation

### Method 1: Safari Web Extension (Recommended for Safari 14+)

1. Open Safari and enable the Develop menu:
   - Go to Safari > Preferences > Advanced
   - Check "Show Develop menu in menu bar"

2. Load the extension:
   - Go to Develop > Allow Unsigned Extensions (for development)
   - Go to Safari > Preferences > Extensions
   - Click "Load Unpacked Extension"
   - Select this `safari-extension` folder

3. Enable the extension:
   - The extension will appear in the Extensions tab
   - Toggle it on to activate

### Method 2: Safari App Extension (Legacy)

*Note: This method requires Xcode and is more complex*

1. Create a Safari App Extension project in Xcode
2. Replace the generated files with the contents of this folder
3. Build and run the project
4. Enable the extension in Safari Preferences

### Method 3: Convert to Safari App Extension

1. Use Safari's built-in converter:
   ```bash
   xcrun safari-web-extension-converter /path/to/safari-extension
   ```
2. Follow the prompts to create an Xcode project
3. Build and install the extension

## Usage

1. Navigate to your Odoo instance on localhost (e.g., `http://localhost:8069`)
2. The extension will automatically start blocking subscription alerts
3. Click the extension icon in Safari's toolbar to view the popup with:
   - Current blocked alert count
   - Extension status
   - Reset counter button
   - Refresh page button

## Technical Details

- **Manifest Version**: 2 (Safari Web Extension standard)
- **Permissions**: `storage`, `activeTab`, `http://localhost/*`, `https://localhost/*`
- **APIs Used**: WebKit WebExtensions API (browser.storage, browser.tabs, browser.runtime)
- **Fallbacks**: localStorage and custom events for older Safari versions
- **Content Security Policy**: Strict CSP for enhanced security

## Files Structure

```
safari-extension/
├── manifest.json     # Safari Web Extension configuration
├── content.js        # Content script with WebKit APIs and fallbacks
├── popup.js          # Popup script with WebKit APIs and fallbacks
├── popup.html        # Extension popup interface
├── icon16.png        # 16x16 icon
├── icon48.png        # 48x48 icon
├── icon128.png       # 128x128 icon
├── icon.svg          # Vector icon
└── README.md         # This file
```

## Browser Compatibility

- ✅ Safari 14+ (Safari Web Extensions)
- ✅ Safari 12-13 (with fallbacks)
- ✅ Safari Technology Preview
- ❌ Chrome/Firefox (use respective browser folders instead)

## Safari-Specific Features

### WebKit API Integration
- Uses `browser` API namespace (WebExtensions standard)
- Graceful fallback to localStorage for older Safari versions
- Custom event system for cross-frame communication

### Security Enhancements
- Strict Content Security Policy
- Web accessible resources properly declared
- Safari-specific CSS properties for better integration

### Performance Optimizations
- Efficient DOM observation with Safari's WebKit engine
- Minimal memory footprint
- Optimized for Safari's JavaScript engine

## Troubleshooting

### Extension not loading?
1. Make sure "Allow Unsigned Extensions" is enabled in Develop menu
2. Check Safari > Preferences > Extensions for the extension
3. Ensure you're using Safari 12 or later
4. Try reloading the extension

### Extension not working?
1. Make sure you're on a localhost URL
2. Check that the extension is enabled in Safari Preferences
3. Refresh the page after installing the extension
4. Check Safari's Web Inspector console for error messages

### No alerts being blocked?
1. Verify you're on an Odoo instance with subscription alerts
2. The extension only works on localhost domains
3. Try refreshing the page to trigger the content script
4. Check if Safari is blocking the extension due to security settings

### Popup not working?
1. Ensure popup blockers are disabled for the extension
2. Check if Safari's privacy settings are blocking the popup
3. Try right-clicking the extension icon and selecting "Show Popup"

## Development

This extension uses Safari's WebExtensions API with comprehensive fallbacks:

- `browser.storage.local` with localStorage fallback
- `browser.tabs` with graceful degradation
- `browser.runtime` with custom event system fallback
- Standard DOM APIs optimized for WebKit

## Safari Web Extension Conversion

To convert this extension to a native Safari App Extension:

```bash
# Navigate to the parent directory
cd /path/to/odoo-alert-blocker

# Convert the Safari extension
xcrun safari-web-extension-converter safari-extension --project-location ./SafariAppExtension

# Open the generated Xcode project
open SafariAppExtension/Odoo\ Alert\ Blocker.xcodeproj
```

## Distribution

### Mac App Store Distribution
1. Convert to Safari App Extension using Xcode
2. Create a containing macOS app
3. Submit to Mac App Store for review

### Direct Distribution
1. Package as a Safari Web Extension
2. Distribute the folder or create an installer
3. Users must enable "Allow Unsigned Extensions" for development versions

## Version

**v1.0.0** - Safari Web Extension optimized version with legacy fallbacks