// Generates the prerender route list and sitemap.xml from a single source of
// truth (src/assets/projects.json), so static routes, project detail pages and
// the sitemap can never drift apart again. Runs automatically before `ng build`.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://itztorero.dev';

const projects = JSON.parse(
  readFileSync(join(root, 'src/assets/projects.json'), 'utf8')
);

const staticRoutes = ['/', '/projects', '/services', '/experience', '/education', '/contact'];
const projectRoutes = projects.map((p) => `/projects/${p.slug}`);
const enRoutes = [...staticRoutes, ...projectRoutes];
// Cada ruta EN tiene su gemela indexable en español bajo /es (mismas páginas,
// idioma fijado por la ruta; hreflang lo emite SeoService en el <head>).
const esRoutes = enRoutes.map((r) => (r === '/' ? '/es' : `/es${r}`));
const routes = [...enRoutes, ...esRoutes];

// 1) Routes file consumed by the Angular prerenderer (angular.json -> prerender.routesFile)
writeFileSync(
  join(root, 'prerender-routes.txt'),
  routes.join('\n') + '\n',
  'utf8'
);

// 2) sitemap.xml (priority by depth, today's lastmod)
const today = new Date().toISOString().slice(0, 10);
const priorityFor = (route) => {
  const bare = route === '/es' ? '/' : route.replace(/^\/es\//, '/');
  if (bare === '/') return '1.0';
  if (bare === '/projects' || bare === '/services') return '0.9';
  if (bare.startsWith('/projects/')) return '0.8';
  return '0.7';
};
const changefreqFor = (route) => (route.endsWith('/contact') ? 'yearly' : 'monthly');

const urls = routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route === '/' ? '/' : route}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priorityFor(route)}</priority>
    <changefreq>${changefreqFor(route)}</changefreq>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, 'src/sitemap.xml'), sitemap, 'utf8');

console.log(
  `[gen-prerender] ${routes.length} routes -> prerender-routes.txt & src/sitemap.xml`
);
