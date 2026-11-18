// Compares generated post URLs in dist/ with the live Jekyll sitemap so links keep working.
import { existsSync } from 'node:fs';

const SITEMAP = process.env.SITEMAP_URL ?? 'https://azure.github.io/AppService/sitemap.xml';
const PREFIX = 'https://azure.github.io/AppService';

const xml = await (await fetch(SITEMAP)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(PREFIX, '').replace(/&(amp|apos|quot|lt|gt);/g, (_, e) => ({ amp: '&', apos: "'", quot: '"', lt: '<', gt: '>' })[e]))
  .filter((u) => /^\/\d{4}\/\d{2}\/\d{2}\/.+\.html$/.test(u));

const missing = urls.filter((u) => !existsSync(`dist${decodeURIComponent(u)}`));
console.log(`${urls.length - missing.length}/${urls.length} live post URLs exist in dist/`);
for (const u of missing) console.log(`  missing: ${u}`);
process.exitCode = missing.length ? 1 : 0;
