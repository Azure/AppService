import { getCollection, type CollectionEntry } from 'astro:content';
import { tagSlug } from './jekyll';

export type Post = CollectionEntry<'posts'>;
export type Page = CollectionEntry<'pages'>;

export const SITE = {
  title: 'Azure App Service',
  tagline: 'Team Blog',
  description:
    'Announcements, updates, deep-dive content, and event information from the Product and Engineering teams that run App Service at Microsoft.',
};

export interface Section {
  title: string;
  shortTitle: string;
  url: string;
  hue: number;
  match: { category?: string; tag?: string };
}

// Order and labels follow the old sidebar's "Product Areas" menu.
export const SECTIONS: Section[] = [
  { shortTitle: 'Networking & ASE', url: '/networking/', hue: 205, title: 'Networking & ASE', match: { category: 'networking' } },
  { shortTitle: 'Java', url: '/java/', hue: 20, title: 'Java on App Service', match: { category: 'java' } },
  { shortTitle: 'Diagnostics', url: '/diagnostics/', hue: 280, title: 'Diagnose and Solve', match: { category: 'diagnostics' } },
  { shortTitle: 'Certs & Domains', url: '/certsdomains/', hue: 150, title: 'Certificates and Domains', match: { category: 'certsdomains' } },
  { shortTitle: 'Deployment', url: '/deployment/', hue: 45, title: 'Deployment, CI/CD, Slots', match: { category: 'deployment' } },
  { shortTitle: 'Windows Containers', url: '/windows-containers/', hue: 190, title: 'Windows Containers', match: { tag: 'windows containers' } },
  { shortTitle: 'Sidecars', url: '/sidecars/', hue: 330, title: 'Sidecars for App Service', match: { tag: 'sidecars' } },
  { shortTitle: 'AI Integration', url: '/ai-integration/', hue: 255, title: 'AI Integration for App Service', match: { tag: 'ai-integration' } },
];

export const RESOURCES = [
  { title: 'Documentation', url: 'https://learn.microsoft.com/azure/app-service/' },
  { title: 'Zero to Hero', url: '/zero-to-hero/' },
  { title: 'Linux FAQ', url: 'https://github.com/Azure/app-service-linux-docs' },
  { title: 'Windows Containers wiki', url: 'https://aka.ms/appservicewindowscontainerwiki' },
  { title: 'Azure Updates', url: 'https://azure.microsoft.com/updates/' },
];

const same = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

export function matchesSection(post: Post, match: Section['match']): boolean {
  if (match.category) return same(post.data.category, match.category);
  if (match.tag) return post.data.tags.some((t) => same(t, match.tag));
  return false;
}

export function sectionFor(post: Post): Section | undefined {
  return SECTIONS.find((s) => matchesSection(post, s.match));
}

let cache: Post[] | undefined;
export async function getPosts(): Promise<Post[]> {
  cache ??= (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || b.id.localeCompare(a.id),
  );
  return cache;
}

export interface TagInfo {
  name: string;
  slug: string;
  posts: Post[];
}

export async function getTags(): Promise<TagInfo[]> {
  const bySlug = new Map<string, TagInfo>();
  for (const post of await getPosts()) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      if (!slug) continue;
      const info = bySlug.get(slug) ?? { name, slug, posts: [] };
      if (!info.posts.includes(post)) info.posts.push(post);
      bySlug.set(slug, info);
    }
  }
  return [...bySlug.values()].sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
