/**
 * Generates a padded Android adaptive-icon foreground (safe zone ~56% of 1024px).
 * Run: npx --yes -p sharp node scripts/generate-android-adaptive-icon.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const input = join(root, 'assets/images/icon_2.png');
const output = join(root, 'assets/images/android-adaptive-foreground.png');

const SIZE = 1024;
/** Logo fits inside the circular mask without clipping corners of the F. */
const SCALE = 0.56;

const inner = Math.round(SIZE * SCALE);
const pad = Math.floor((SIZE - inner) / 2);

await sharp(input)
  .resize(inner, inner, { fit: 'contain' })
  .extend({
    top: pad,
    bottom: SIZE - inner - pad,
    left: pad,
    right: SIZE - inner - pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(output);

console.log(`Wrote ${output} (${inner}px logo + ${pad}px padding)`);
