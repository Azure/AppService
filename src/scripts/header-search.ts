interface SearchDocument {
  url: string;
  meta: { title?: string };
  excerpt: string;
}

interface SearchIndex {
  search: (query: string) => Promise<{
    results: { data: () => Promise<SearchDocument> }[];
  }>;
}

const root = document.querySelector<HTMLElement>('[data-header-search]');
if (root) {
  const form = root.querySelector('form')!;
  const input = root.querySelector('input')!;
  const panel = root.querySelector<HTMLElement>('.search-popover')!;
  const status = root.querySelector<HTMLElement>('.search-status')!;
  const results = root.querySelector('ul')!;
  const allResults = root.querySelector<HTMLAnchorElement>('.search-all')!;
  let index: Promise<SearchIndex> | undefined;
  let revision = 0;
  let active = -1;
  let timer: ReturnType<typeof setTimeout>;

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', results.id);
  input.setAttribute('aria-expanded', 'false');

  function select(position: number) {
    const options = results.querySelectorAll<HTMLAnchorElement>('[role="option"]');
    active = position;
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === position)));
    const option = options[position];
    if (option) {
      input.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function close() {
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    select(-1);
  }

  async function search() {
    const current = ++revision;
    const query = input.value.trim();
    results.replaceChildren();
    select(-1);
    allResults.href = `/search/?${new URLSearchParams({ q: query })}`;
    allResults.hidden = !query;
    status.textContent = query ? 'Searching...' : 'Type to search the blog.';
    if (!query) return;

    try {
      if (!index) {
        const path = '/pagefind/pagefind.js';
        index = import(/* @vite-ignore */ path).catch((error: unknown) => {
          index = undefined;
          throw error;
        });
      }
      const response = await (await index).search(query);
      const documents = await Promise.all(response.results.slice(0, 6).map((result) => result.data()));
      if (current !== revision) return;
      status.textContent = response.results.length
        ? `${response.results.length} ${response.results.length === 1 ? 'result' : 'results'}${response.results.length > 6 ? '; showing the first 6' : ''}.`
        : 'No matching posts. Try another search.';

      for (const [i, result] of documents.entries()) {
        const item = document.createElement('li');
        item.setAttribute('role', 'presentation');
        const link = document.createElement('a');
        link.href = result.url;
        link.id = `header-search-result-${i}`;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');
        link.tabIndex = -1;
        const title = document.createElement('strong');
        title.textContent = result.meta.title ?? result.url;
        const excerpt = document.createElement('span');
        excerpt.textContent = new DOMParser().parseFromString(result.excerpt, 'text/html').body.textContent;
        link.append(title, excerpt);
        item.append(link);
        results.append(item);
      }
    } catch (error) {
      console.error('Header search failed.', error);
      if (current === revision) status.textContent = 'Search is unavailable. Reload to retry, or browse All posts.';
    }
  }

  function open() {
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('focus', () => {
    open();
    void search();
  });
  input.addEventListener('click', open);
  input.addEventListener('input', () => {
    clearTimeout(timer);
    ++revision;
    results.replaceChildren();
    select(-1);
    open();
    status.textContent = input.value.trim() ? 'Searching...' : 'Type to search the blog.';
    allResults.hidden = true;
    timer = setTimeout(() => void search(), 150);
  });
  form.addEventListener('submit', (event) => {
    const selected = results.querySelector<HTMLAnchorElement>('[aria-selected="true"]');
    if (selected && !panel.hidden) {
      event.preventDefault();
      selected.click();
    }
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      input.focus();
      close();
    } else if (event.target === input && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      const count = results.children.length;
      if (!count) return;
      event.preventDefault();
      open();
      select(active < 0
        ? (event.key === 'ArrowDown' ? 0 : count - 1)
        : (active + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    }
  });
  root.addEventListener('focusout', (event) => {
    if (!(event.relatedTarget instanceof Node) || !root.contains(event.relatedTarget)) close();
  });
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && !root.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
      && target instanceof HTMLElement
      && !target.matches('input, textarea, select') && !target.isContentEditable) {
      event.preventDefault();
      input.focus();
      open();
    }
  });
}
