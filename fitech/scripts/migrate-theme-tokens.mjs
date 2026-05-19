#!/usr/bin/env node
/**
 * One-off codemod: legacy flat theme keys → nested `colors` tokens.
 * Run: node scripts/migrate-theme-tokens.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const REPLACEMENTS = [
  ['theme.successBackground', 'theme.status.success.bg'],
  ['theme.successBorder', 'theme.status.success.border'],
  ['theme.successText', 'theme.status.success.text'],
  ['theme.success', 'theme.status.success.icon'],
  ['theme.warningBackground', 'theme.status.warning.bg'],
  ['theme.warningBorder', 'theme.status.warning.border'],
  ['theme.warningText', 'theme.status.warning.text'],
  ['theme.warning', 'theme.status.warning.icon'],
  ['theme.errorBackground', 'theme.status.error.bg'],
  ['theme.errorBorder', 'theme.status.error.border'],
  ['theme.errorText', 'theme.status.error.text'],
  ['theme.error', 'theme.status.error.icon'],
  ['theme.infoBackground', 'theme.status.info.bg'],
  ['theme.infoBorder', 'theme.status.info.border'],
  ['theme.infoText', 'theme.status.info.text'],
  ['theme.info', 'theme.status.info.icon'],
  ['theme.orangeBackground', 'theme.status.warning.bgStrong'],
  ['theme.orangeBorder', 'theme.status.warning.border'],
  ['theme.orangeText', 'theme.status.warning.text'],
  ['theme.orange', 'theme.status.warning.icon'],
  ['theme.backgroundInverted', 'theme.text.primary'],
  ['theme.backgroundInput', 'theme.background.input'],
  ['theme.backgroundDropdown', 'theme.background.cardHover'],
  ['theme.backgroundHeader', 'theme.background.elevated'],
  ['theme.textPrimary', 'theme.text.primary'],
  ['theme.textSecondary', 'theme.text.secondary'],
  ['theme.fixedHeaderTitleColor', 'theme.text.primary'],
  ['theme.fixedHeaderSubheaderColor', 'theme.text.secondary'],
  ['theme.fixedHeaderBorder', 'theme.border.subtle'],
  ['theme.headerBackButtonBg', 'theme.header.backButtonBg'],
  ['theme.headerBackButtonBorderWidth', 'theme.header.backButtonBorderWidth'],
  ['theme.headerBackButtonBorder', 'theme.border.default'],
  ['theme.primaryText', 'theme.brand.primaryLight'],
  ['theme.primaryBg', 'theme.brand.primarySoft'],
  ['theme.green100', 'theme.status.success.bgStrong'],
  ['theme.green200', 'theme.brand.primaryDark'],
  ['theme.green300', 'theme.brand.primaryDark'],
  ['theme.green400', 'theme.brand.primary'],
  ['theme.green500', 'theme.brand.primary'],
  ['theme.green600', 'theme.brand.primaryLight'],
  ['theme.green700', 'theme.brand.primaryLight'],
  ['theme.green800', 'theme.brand.primaryDark'],
  ['theme.green900', 'theme.text.primary'],
  ['theme.dark100', 'theme.background.app'],
  ['theme.dark200', 'theme.background.card'],
  ['theme.dark300', 'theme.background.elevated'],
  ['theme.dark400', 'theme.text.tertiary'],
  ['theme.dark500', 'theme.text.disabled'],
  ['theme.dark600', 'theme.text.secondary'],
  ['theme.dark700', 'theme.icon.muted'],
  ['theme.dark800', 'theme.icon.secondary'],
  ['theme.dark900', 'theme.text.primary'],
  ['theme.primary', 'theme.brand.primary'],
  ['theme.secondary', 'theme.background.card'],
  ['theme.tertiary', 'theme.text.tertiary'],
  ['theme.card', 'theme.background.card'],
  [/theme\.border(?!\.)/g, 'theme.border.default'],
  [/theme\.background(?!\.)/g, 'theme.background.app'],
  [/theme\.icon(?!\.)/g, 'theme.icon.secondary'],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'scripts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(tsx?|md)$/.test(name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  if (file.includes('migrate-theme-tokens')) continue;
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('theme.')) continue;
  const before = src;
  for (const [from, to] of REPLACEMENTS) {
    src = typeof from === 'string' ? src.split(from).join(to) : src.replace(from, to);
  }
  if (src !== before) {
    fs.writeFileSync(file, src);
    changed++;
    console.log(path.relative(root, file));
  }
}
console.log(`Updated ${changed} files.`);
