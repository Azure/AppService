// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set BLOG_SITE_URL to the public origin to emit absolute canonical and RSS links.
  site: process.env.BLOG_SITE_URL || undefined,
  // Keeps the Jekyll URL shapes: /YYYY/MM/DD/slug.html for posts and /section/ for pages.
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
