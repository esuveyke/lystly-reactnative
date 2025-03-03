const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define colors from the logo
const LIME_GREEN = '#c9d526';
const RED = '#ff3b30';
const TEAL = '#00b8d4';
const PINK = '#ff4081';

// Define paths
const ASSETS_DIR = path.join(__dirname, '../assets/images');
const GENERATED_DIR = path.join(ASSETS_DIR, 'generated');
const LOGO_PATH = path.join(ASSETS_DIR, 'logo.png');
const SPLASH_PATH = path.join(ASSETS_DIR, 'splash.png');
const ICON_PATH = path.join(ASSETS_DIR, 'icon.png');
const FAVICON_PATH = path.join(ASSETS_DIR, 'favicon.png');

// Create directories if they don't exist
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// Function to execute shell commands
function execute(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
  }
}

// Generate splash screen (1242x2436 - iPhone X resolution)
console.log('Generating splash screen...');
execute(`
  sharp ${LOGO_PATH} \\
    -resize 900x \\
    -background "${LIME_GREEN}" \\
    -flatten \\
    -extend 1242x2436 \\
    -gravity center \\
    -o ${SPLASH_PATH}
`);

// Generate app icon (1024x1024)
console.log('Generating app icon...');
execute(`
  sharp ${LOGO_PATH} \\
    -resize 800x \\
    -background "${LIME_GREEN}" \\
    -flatten \\
    -resize 1024x1024 \\
    -extend 1024x1024 \\
    -gravity center \\
    -o ${ICON_PATH}
`);

// Generate favicon (48x48)
console.log('Generating favicon...');
execute(`
  sharp ${LOGO_PATH} \\
    -resize 40x \\
    -background "${LIME_GREEN}" \\
    -flatten \\
    -resize 48x48 \\
    -extend 48x48 \\
    -gravity center \\
    -o ${FAVICON_PATH}
`);

console.log('Image generation complete!');
console.log('Generated files:');
console.log(`- Splash screen: ${SPLASH_PATH}`);
console.log(`- App icon: ${ICON_PATH}`);
console.log(`- Favicon: ${FAVICON_PATH}`); 