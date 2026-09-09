/**
 * Script to resize the CartCraze logo to all required Android mipmap densities
 * and save as PNG files for the app launcher icon.
 */
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const SRC_IMAGE = path.resolve(__dirname, '../android_app/app/src/main/res/drawable/ic_app_logo.jpg');
const MIPMAP_BASE = path.resolve(__dirname, '../android_app/app/src/main/res');

// Android mipmap densities and their launcher icon sizes (px)
const DENSITIES = [
  { folder: 'mipmap-mdpi',    size: 48 },
  { folder: 'mipmap-hdpi',    size: 72 },
  { folder: 'mipmap-xhdpi',   size: 96 },
  { folder: 'mipmap-xxhdpi',  size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
  console.log('Loading source image:', SRC_IMAGE);
  const buf = require('fs').readFileSync(SRC_IMAGE);
  const img = await Jimp.read(buf);

  for (const density of DENSITIES) {
    const outDir = path.join(MIPMAP_BASE, density.folder);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Square icon
    const iconPath = path.join(outDir, 'ic_launcher.png');
    await img.clone().resize({ w: density.size, h: density.size }).write(iconPath);
    console.log(`  ✓ ${density.folder}/ic_launcher.png (${density.size}x${density.size})`);

    // Round icon (same image - Android clips it to circle)
    const roundPath = path.join(outDir, 'ic_launcher_round.png');
    await img.clone().resize({ w: density.size, h: density.size }).write(roundPath);
    console.log(`  ✓ ${density.folder}/ic_launcher_round.png (${density.size}x${density.size})`);
  }
  
  // Also copy a 512x512 for the drawable folder (for foreground)
  const foregroundPath = path.join(MIPMAP_BASE, 'drawable', 'ic_launcher_logo.png');
  await img.clone().resize({ w: 512, h: 512 }).write(foregroundPath);
  console.log('  ✓ drawable/ic_launcher_logo.png (512x512)');
  
  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
