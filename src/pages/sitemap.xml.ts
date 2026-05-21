import { routes } from "../data/site";

const siteUrl = "https://siimki.github.io";

const pages = [
  routes.et.home,
  routes.et.about,
  routes.et.services,
  routes.et.projects,
  routes.et.contact,
  routes.en.home,
  routes.en.about,
  routes.en.services,
  routes.en.projects,
  routes.en.contact,
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((path) => `  <url><loc>${new URL(path, siteUrl).toString()}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
