// Helpers that reproduce the Jekyll behavior the existing content depends on,
// so post URLs and in-post links keep working after the move to Astro.

const FILENAME_RE = /^(\d{2,4})-(\d{1,2})-(\d{1,2})-(.*)\.(md|markdown|html)$/;

// Jekyll::Utils.slugify(mode: "pretty", cased: true), used for :title in permalinks.
export function prettySlug(value: string): string {
  return value.replace(/[^\p{L}\p{N}._~!$&'()+,;=@]+/gu, '-').replace(/^-+|-+$/g, '');
}

// Jekyll::Utils.slugify default mode, used for tag and category pages.
export function tagSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

const pad = (n: number | string) => String(n).padStart(2, '0');

export interface PostLocation {
  date: Date;
  year: string;
  month: string;
  day: string;
  slug: string;
  url: string;
}

export function locatePost(fileName: string, frontMatterDate?: unknown): PostLocation | undefined {
  const match = FILENAME_RE.exec(fileName);
  if (!match) return undefined;
  const [, y, m, d, title] = match;
  let year = y, month = pad(m), day = pad(d);

  if (frontMatterDate instanceof Date && !Number.isNaN(frontMatterDate.valueOf())) {
    year = String(frontMatterDate.getUTCFullYear());
    month = pad(frontMatterDate.getUTCMonth() + 1);
    day = pad(frontMatterDate.getUTCDate());
  } else if (typeof frontMatterDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(frontMatterDate)) {
    [year, month, day] = frontMatterDate.slice(0, 10).split('-');
  }

  // Jekyll collapses the trailing dot of names like "Title..md" into a single ".html".
  const slug = prettySlug(title).replace(/\.+$/, "");
  return {
    date: new Date(`${year}-${month}-${day}T12:00:00Z`),
    year,
    month,
    day,
    slug,
    url: `/${year}/${month}/${day}/${slug}.html`,
  };
}

const RAW_RE = /\{%-?\s*raw\s*-?%\}([\s\S]*?)\{%-?\s*endraw\s*-?%\}/g;

// Resolves the Liquid tags used inside posts. Text inside {% raw %} is left untouched.
export function resolveLiquid(body: string, urlFor: (ref: string) => string | undefined): string {
  const segments: string[] = [];
  let last = 0;
  for (const m of body.matchAll(RAW_RE)) {
    segments.push(transform(body.slice(last, m.index), urlFor), m[1]);
    last = m.index! + m[0].length;
  }
  segments.push(transform(body.slice(last), urlFor));
  return segments.join('');
}

function transform(text: string, urlFor: (ref: string) => string | undefined): string {
  return text
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
    .replace(/\{\{-?\s*site\.baseurl\s*-?\}\}/g, '')
    .replace(/\{%-?\s*(post_url|link)\s+(.+?)\s*-?%\}/g, (whole, _tag, ref: string) => urlFor(ref.trim()) ?? whole)
    .replace(/\{%-?\s*include\s+video\s+id="([^"]+)"\s+provider="youtube"\s*-?%\}/g, (_m, id: string) =>
      `\n<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n`)
    // kramdown attribute lists such as {: .align-center} or {:target="_blank"}
    .replace(/\{:[^}\n]*\}/g, '');
}

// Legacy posts imported as full HTML documents.
export function unwrapHtmlDocument(html: string): string {
  return html
    .replace(/<head>[\s\S]*?<\/head>/i, '')
    .replace(/<\/?(html|body)[^>]*>/gi, '');
}

export function plainText(html: string): string {
  return html
    .replace(/<(script|style|pre|figure)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text: string, max = 220): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max)}…`;
}
