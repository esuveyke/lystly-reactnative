const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Define colors from the logo
const LIME_GREEN = '#c9d526';
const RED = '#ff3b30';
const TEAL = '#00b8d4';
const PINK = '#ff4081';

// Define paths
const ASSETS_DIR = path.join(__dirname, '../assets/images');
const LOGO_PATH = path.join(ASSETS_DIR, 'logo.png');

async function createLogo() {
  try {
    // Create a canvas for the logo (1200x800)
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    // Draw lime green background with rounded corners
    ctx.fillStyle = LIME_GREEN;
    roundRect(ctx, 0, 0, 1200, 600, 50, true, false);

    // Draw "Lystly" text
    ctx.fillStyle = RED;
    ctx.font = 'bold 240px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Lystly', 600, 300);

    // Draw teal banner with pink border
    ctx.save();
    ctx.translate(600, 650);
    ctx.rotate(-Math.PI / 60); // Slight rotation
    
    // Pink border
    ctx.fillStyle = PINK;
    roundRect(ctx, -550, -50, 1100, 100, 40, true, false);
    
    // Teal fill (slightly smaller)
    ctx.fillStyle = TEAL;
    roundRect(ctx, -545, -45, 1090, 90, 35, true, false);
    
    // White text
    ctx.fillStyle = 'white';
    ctx.font = 'italic bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("You'll never lose anything again!", 0, 0);
    ctx.restore();

    // Save the logo
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(LOGO_PATH, buffer);
    
    console.log(`Logo created at: ${LOGO_PATH}`);
  } catch (error) {
    console.error('Error creating logo:', error);
  }
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
  }
  
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  
  if (fill) {
    ctx.fill();
  }
  
  if (stroke) {
    ctx.stroke();
  }
}

// Run the function
createLogo(); 