import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="28" fill="#006a64"/>
  <rect x="6" y="6" width="116" height="116" rx="22" fill="none" stroke="#ffffff" stroke-width="6"/>
  <text x="64" y="88" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle" letter-spacing="-2">VT</text>
</svg>`;

const publicDir = path.join(__dirname, 'public');
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), svgContent, 'utf8');

console.log('Favicon generated successfully!');
