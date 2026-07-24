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

const staticRoutes = ['/', '/projects', '/experience', '/education', '/contact'];
const projectRoutes = projects.map((p) => `/projects/${p.slug}`);
const routes = [...staticRoutes, ...projectRoutes];

// 1) Routes file consumed by the Angular prerenderer (angular.json -> prerender.routesFile)
writeFileSync(
  join(root, 'prerender-routes.txt'),
  routes.join('\n') + '\n',
  'utf8'
);

// 2) sitemap.xml (priority by depth, today's lastmod)
const today = new Date().toISOString().slice(0, 10);
const priorityFor = (route) => {
  if (route === '/') return '1.0';
  if (route === '/projects') return '0.9';
  if (route.startsWith('/projects/')) return '0.8';
  return '0.7';
};
const changefreqFor = (route) => (route === '/contact' ? 'yearly' : 'monthly');

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
