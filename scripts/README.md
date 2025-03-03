# App Image Generation Scripts

This directory contains scripts for generating various app images from a source logo.

## Available Scripts

### `generate-all-app-images.js`

The main script that generates all app images from a single source logo.

```bash
node scripts/generate-all-app-images.js
```

This script generates:
- `original_icon.png` (1024x1024) - Square version of the logo with padding
- `icon.png` (1024x1024) - App icon with rounded corners for app stores
- `favicon.png` (32x32) - Small icon for web browsers
- `splash.png` (1242x2436) - Splash screen image for app launch

### `generate-favicon.js`

Generates only the favicon for web use.

```bash
node scripts/generate-favicon.js
```

### `generate-app-icons.js`

Generates the original_icon and icon.png files.

```bash
node scripts/generate-app-icons.js
```

## Customization

If you need to customize the image generation process:

1. Edit the respective script file
2. Adjust parameters like:
   - Image dimensions
   - Background color (currently set to #c9d526)
   - Padding and margins
   - Corner radius for the app icon

## Requirements

These scripts require the `sharp` image processing library:

```bash
npm install sharp
```

## Source Image

All scripts use `assets/images/logo.png` as the source image. Make sure this file exists before running the scripts. 