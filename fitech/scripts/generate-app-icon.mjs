/**
 * Generates the main 1024×1024 app icon used by iOS, splash, and web favicon.
 * Run: npm run generate:app-icon
 */
import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const input = join(root, 'assets/images/logos/fitech_logo.png');
const output = join(root, 'assets/images/logos/app-icon.png');

const SIZE = 1024;
const BACKGROUND = { r: 0, g: 0, b: 0, alpha: 1 };

await sharp(input)
  .resize(SIZE, SIZE, {
    fit: 'contain',
    background: BACKGROUND,
  })
  .flatten({ background: { r: 0, g: 0, b: 0 } })
  .png()
  .toFile(output);

console.log(`Wrote ${output}`);
