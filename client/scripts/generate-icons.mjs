/**
 * generate-icons.mjs
 * Run: node scripts/generate-icons.mjs
 * Reads the source PNG from artifacts and writes all PWA icon sizes to /public
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir  = join(__dirname, '..', 'public');

// Source: copy the generated icon here
const src = join(__dirname, 'icon-source.png');

if (!existsSync(src)) {
  console.error('❌  Place your source icon at scripts/icon-source.png first!');
  process.exit(1);
}

const sizes = [
  { file: 'pwa-64x64.png',      size: 64  },
  { file: 'pwa-192x192.png',    size: 192 },
  { file: 'pwa-512x512.png',    size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-32x32.png',  size: 32  },
];

for (const { file, size } of sizes) {
  await sharp(src).resize(size, size).toFile(join(publicDir, file));
  console.log(`✅  ${file} (${size}x${size})`);
}

console.log('\n🎉  All icons generated in /public');
