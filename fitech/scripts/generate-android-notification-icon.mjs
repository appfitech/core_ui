/**
 * Android status-bar / notification icon: white shape on transparent background only.
 * Accent color comes from expo-notifications `color` in app.json (#39CC39).
 *
 * Run: npm run generate:android-notification-icon
 */
import sharp from 'sharp';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const INPUT_CANDIDATES = [
  join(root, 'assets/images/logos/rounded_logo.webp'),
  join(root, 'assets/images/logos/app-icon.png'),
];

const output = join(root, 'assets/images/logos/android-notification-icon.png');
const SIZE = 96;

const resolvedInput = INPUT_CANDIDATES.find((p) => existsSync(p));
if (!resolvedInput) {
  throw new Error(
    `No source image found. Expected one of:\n${INPUT_CANDIDATES.join('\n')}`,
  );
}

const { data, info } = await sharp(resolvedInput)
  .resize(SIZE, SIZE, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(info.width * info.height * 4);

for (let i = 0; i < info.width * info.height; i++) {
  const offset = i * 4;
  const r = data[offset];
  const g = data[offset + 1];
  const b = data[offset + 2];
  const a = data[offset + 3];

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const visible = a > 40 && luminance < 245;

  if (visible) {
    out[offset] = 255;
    out[offset + 1] = 255;
    out[offset + 2] = 255;
    out[offset + 3] = 255;
  }
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(output);

console.log(`Wrote ${output} from ${resolvedInput}`);
