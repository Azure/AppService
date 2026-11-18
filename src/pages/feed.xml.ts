import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).slice(0, 30);
  return rss({
    title: `${SITE.title} ${SITE.tagline}`,
    description: SITE.description,
    site: context.site ?? 'http://localhost',
    items: posts.map((post) => ({
      title: post.data.title,
      link: post.data.url,
      pubDate: post.data.date,
      description: post.data.excerpt,
      author: post.data.author,
      categories: post.data.tags,
    })),
  });
}
