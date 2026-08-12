import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const svgPath = path.join(publicDir, 'favicon.svg');
const icoPath = path.join(publicDir, 'favicon.ico');

const content = fs.readFileSync(svgPath, 'utf8');
fs.writeFileSync(icoPath, content, 'utf8');

console.log('Favicon updated successfully!');
