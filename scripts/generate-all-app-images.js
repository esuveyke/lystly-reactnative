const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define paths
const logoPath = path.join(__dirname, '../assets/images/logo.png');
const originalIconPath = path.join(__dirname, '../assets/images/original_icon.png');
const iconPath = path.join(__dirname, '../assets/images/icon.png');
const faviconPath = path.join(__dirname, '../assets/images/favicon.png');
const splashPath = path.join(__dirname, '../assets/images/splash.png');

// Define brand color
const brandColor = { r: 201, g: 213, b: 38, alpha: 1 }; // #c9d526 in RGB

// Ensure the output directory exists
const outputDir = path.dirname(iconPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate all app images
async function generateAllAppImages() {
  try {
    console.log('Generating app images from logo...');
    
    // 1. Generate original_icon (square version of logo with padding)
    await sharp(logoPath)
      .resize(820, 820, {
        fit: 'contain',
        background: brandColor
      })
      .extend({
        top: 102,
        bottom: 102,
        left: 102,
        right: 102,
        background: brandColor
      })
      .toFile(originalIconPath);
    
    console.log(`✅ Original icon generated at: ${originalIconPath}`);
    
    // 2. Generate app icon (with rounded corners)
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
    
    console.log(`✅ App icon generated at: ${iconPath}`);
    
    // 3. Generate favicon (32x32)
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: brandColor
      })
      .toFile(faviconPath);
    
    console.log(`✅ Favicon generated at: ${faviconPath}`);
    
    // 4. Generate splash screen (1242x2436 - optimal for most devices)
    // Create a larger canvas with the logo centered
    await sharp(logoPath)
      .resize(800, 500, {
        fit: 'contain',
        background: brandColor
      })
      .extend({
        top: 968,
        bottom: 968,
        left: 221,
        right: 221,
        background: brandColor
      })
      .toFile(splashPath);
    
    console.log(`✅ Splash screen generated at: ${splashPath}`);
    
    console.log('\nAll app images generated successfully! 🎉');
    console.log('\nImage sizes:');
    
    // Get and display file sizes
    const files = [
      { name: 'Original Icon', path: originalIconPath },
      { name: 'App Icon', path: iconPath },
      { name: 'Favicon', path: faviconPath },
      { name: 'Splash Screen', path: splashPath }
    ];
    
    for (const file of files) {
      const stats = fs.statSync(file.path);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`- ${file.name}: ${fileSizeKB} KB`);
    }
    
  } catch (error) {
    console.error('Error generating app images:', error);
  }
}

generateAllAppImages(); 