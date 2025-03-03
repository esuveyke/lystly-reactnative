const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define paths
const logoPath = path.join(__dirname, '../assets/images/logo.png');
const faviconPath = path.join(__dirname, '../assets/images/favicon.png');

// Ensure the output directory exists
const outputDir = path.dirname(faviconPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate favicon (32x32 pixels, which is standard for favicons)
async function generateFavicon() {
  try {
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 201, g: 213, b: 38, alpha: 1 } // #c9d526 in RGB
      })
      .toFile(faviconPath);
    
    console.log(`Favicon generated successfully at: ${faviconPath}`);
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 