# portfolio-itztorero

Sitio personal de portafolio de Juan Pablo Valenzuela Castro, en producción en [itztorero.dev](https://itztorero.dev).

## Stack

- **Angular 17** (standalone components + signals)
- **Transloco** para i18n EN/ES — el español vive bajo el prefijo `/es/*` y se prerenderiza igual que el inglés (hreflang en el `<head>` vía `SeoService`)
- **Prerender estático (SSG)**: las rutas se generan desde `src/assets/projects.json` con `scripts/gen-prerender.mjs` (corre solo en el `prebuild`)
- **Firebase Hosting** sirve `dist/portfolio-itztorero/browser`

## Desarrollo

```bash
npm install
npm start          # ng serve → http://localhost:4200
```

## Build y deploy

```bash
npm run build      # prebuild regenera prerender-routes.txt y src/sitemap.xml, luego ng build (prerender)
npm run deploy     # firebase deploy --only hosting (manual, sin CI)
```

## Contenido

Todo el contenido editable vive en datos, no en componentes:

- `src/assets/projects.json` — proyectos (bilingüe, con `ownership`, `status`, `categories` y `metaDescription` ≤155 chars por proyecto)
- `src/assets/experience.json` / `education.json` — trayectoria (bilingüe)
- `src/assets/i18n/en.json` / `es.json` — todos los textos de la interfaz
- `src/assets/CV_JuanPablo_Valenzuela_{EN,ES}.pdf` — CVs descargables (solo PDF; no publicar `.docx`)

## Pendientes conocidos

- `AnalyticsService` (`src/app/shared/analytics.service.ts`) es un no-op hasta pegar el Measurement ID de GA4.
- El formulario de contacto cae a `mailto:` hasta pegar la access key de Web3Forms en `contact.component.ts`.
