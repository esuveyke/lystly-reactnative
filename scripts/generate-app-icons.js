const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define paths
const logoPath = path.join(__dirname, '../assets/images/logo.png');
const originalIconPath = path.join(__dirname, '../assets/images/original_icon.png');
const iconPath = path.join(__dirname, '../assets/images/icon.png');

// Ensure the output directory exists
const outputDir = path.dirname(iconPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons
async function generateIcons() {
  try {
    // First, create a square version of the logo with padding (original_icon)
    // This will be a 1024x1024 image with the logo centered
    await sharp(logoPath)
      .resize(820, 820, { // Slightly smaller to allow for padding
        fit: 'contain',
        background: { r: 201, g: 213, b: 38, alpha: 1 } // #c9d526 in RGB
      })
      .extend({
        top: 102,
        bottom: 102,
        left: 102,
        right: 102,
        background: { r: 201, g: 213, b: 38, alpha: 1 } // #c9d526 in RGB
      })
      .toFile(originalIconPath);
    
    console.log(`Original icon generated successfully at: ${originalIconPath}`);
    
    // Now create the app icon (1024x1024 for app stores)
    // This is the same as original_icon but with rounded corners
    const roundedCorners = Buffer.from(
      '<svg><rect x="0" y="0" width="1024" height="1024" rx="180" ry="180"/></svg>'
    );
    
    await sharp(originalIconPath)
      .resize(1024, 1024)
      .composite([{
        input: roundedCorners,
        blend: 'dest-in'
      }])
      .toFile(iconPath);
    
    console.log(`App icon generated successfully at: ${iconPath}`);
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 