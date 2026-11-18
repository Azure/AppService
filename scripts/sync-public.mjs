// Copies the shared media and image folders into Astro's public/ directory so
// existing post links such as /media/2024/01/diagram.png keep resolving.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';

const copies = [
  ['media', 'public/media'],
  ['assets/images', 'public/assets/images'],
];

for (const [from, to] of copies) {
  if (!existsSync(from)) continue;
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}
console.log('Synced media into public/');
