# VAP Ventilatsioon static site

Astro static site for `https://siimki.github.io`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The generated site is written to `docs/` so GitHub Pages can publish it from the `main` branch without GitHub Actions. The generated `docs/.nojekyll` file lets GitHub Pages serve Astro's `_astro` asset directory.

## Updating Projects

The project archive lives in `src/data/projects.ts`.

Edit the relevant year/status group, then rebuild:

```bash
npm run build
```

No WordPress admin, database, or backend service is required.
