# [App Service Team Blog](https://azure.github.io/AppService/)

This is the repository for the team blog. See the GitHub Pages site at [azure.github.io/AppService/](https://azure.github.io/AppService/).

Want to publish? See [contributing.md](CONTRIBUTING.md) for instructions.

## App Service Builder POC (Astro)

This branch builds the blog with [Astro](https://astro.build) instead of Jekyll and GitHub Actions. Posts stay in `_posts/` and images in `media/`; post URLs match the existing site.

```bash
npm ci
npm run dev          # local preview at http://localhost:4321
npm run build        # static site + Pagefind search index in dist/
npm run check:urls   # verify every live post URL exists in dist/
```

App Service Builder builds the site from source using `builder.yaml`.
