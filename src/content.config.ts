import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import matter from 'gray-matter';
import yaml from 'js-yaml';

// Jekyll tolerates duplicate front-matter keys (last wins); js-yaml's json mode matches that.
// Jekyll emits titles as raw HTML, so entities such as &lt; display as characters.
const decodeEntities = (s: string) =>
  s.replace(/&(lt|gt|quot|apos|#39|amp);/g, (_, e: string) => ({ lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", amp: '&' })[e]!);

const matterOptions = { engines: { yaml: (s: string) => yaml.safeLoad(s, { json: true }) as object } };
import { readdir, readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { locatePost, plainText, resolveLiquid, truncate, unwrapHtmlDocument } from './lib/jekyll';

const POSTS_DIR = '_posts';

const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
  return [];
};

const postsLoader: Loader = {
  name: 'jekyll-posts',
  async load({ store, parseData, renderMarkdown, generateDigest, logger }) {
    store.clear();
    const files = (await readdir(POSTS_DIR)).filter((f) => /\.(md|markdown|html)$/.test(f));
    const now = Date.now();

    const parsed = await Promise.all(
      files.map(async (file) => {
        const raw = await readFile(join(POSTS_DIR, file), 'utf8');
        const { data, content } = matter(raw, matterOptions);
        const location = locatePost(file, data.date);
        return location ? { file, data, content, location } : undefined;
      }),
    );

    const urlByRef = new Map<string, string>();
    for (const p of parsed) {
      if (!p) continue;
      urlByRef.set(basename(p.file, extname(p.file)), p.location.url);
      urlByRef.set(p.file, p.location.url);
    }
    const urlFor = (ref: string) => urlByRef.get(basename(ref)) ?? urlByRef.get(basename(ref, extname(ref)));

    let skippedFuture = 0;
    for (const p of parsed) {
      if (!p) continue;
      const { file, data, content, location } = p;
      if (location.date.valueOf() > now) {
        skippedFuture++;
        continue;
      }

      const legacy = file.endsWith('.html');
      let body = resolveLiquid(content, urlFor);
      let author: string | undefined = data.author_name ?? data.author;

      if (legacy) {
        body = unwrapHtmlDocument(body);
        const byline = /<a[^>]*profile-usercard-hover[^>]*>([^<]+)<\/a>\s*<time>[^<]*<\/time>/i.exec(body);
        if (byline) {
          author ??= byline[1].trim();
          body = body.replace(byline[0], '');
        }
      }

      const rendered = legacy
        ? { html: body, metadata: { headings: [] } }
        : await renderMarkdown(body, { fileURL: pathToFileURL(join(process.cwd(), POSTS_DIR, file)) });

      const text = plainText(rendered.html);
      const firstParagraph = /<p>([\s\S]*?)<\/p>/i.exec(rendered.html)?.[1];
      const excerpt = data.excerpt
        ? String(data.excerpt)
        : truncate(plainText(firstParagraph ?? '') || text);

      const id = location.url.slice(1, -'.html'.length);
      const parsedData = await parseData({
        id,
        data: {
          title: decodeEntities(String(data.title ?? location.slug).trim()),
          author,
          date: location.date,
          url: location.url,
          year: location.year,
          month: location.month,
          day: location.day,
          slug: location.slug,
          tags: toList(data.tags),
          category: data.category ? String(data.category) : undefined,
          excerpt,
          toc: Boolean(data.toc),
          legacy,
          sourcePath: `${POSTS_DIR}/${file}`,
          readingMinutes: Math.max(1, Math.round(text.split(' ').length / 200)),
        },
      });

      store.set({ id, data: parsedData, rendered, digest: generateDigest(`${file}\n${content}`) });
    }
    logger.info(`Loaded ${store.keys().length} posts (${skippedFuture} scheduled for the future)`);
  },
};

const posts = defineCollection({
  loader: postsLoader,
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    date: z.date(),
    url: z.string(),
    year: z.string(),
    month: z.string(),
    day: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
    category: z.string().optional(),
    excerpt: z.string(),
    toc: z.boolean(),
    legacy: z.boolean(),
    sourcePath: z.string(),
    readingMinutes: z.number(),
  }),
});

// Section landing pages and other standalone pages from the Jekyll site.
const pages = defineCollection({
  loader: glob({ base: '_pages', pattern: ['team_pages/**/*.md', 'zero-to-hero.md'] }),
  schema: z.object({
    title: z.string().optional(),
    permalink: z.string(),
    pagination: z
      .object({ category: z.string().optional(), tag: z.string().optional() })
      .passthrough()
      .optional(),
  }),
});

export const collections = { posts, pages };
