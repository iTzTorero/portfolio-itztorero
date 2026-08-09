import { inject } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

// El idioma lo decide la URL (/es/* → español). El guard corre antes de
// instanciar el componente, así el SSR/prerender y el SeoService ven el
// idioma correcto desde el constructor.
const setLang = (lang: 'en' | 'es'): CanActivateFn => () => {
  inject(TranslocoService).setActiveLang(lang);
  return true;
};

// Los títulos definitivos los pone SeoService en cada página; aquí no hay
// `title` para evitar los dos formatos de marca que convivían antes.
const pages = (lang: 'en' | 'es'): Routes => [
  { path: '', pathMatch: 'full', canActivate: [setLang(lang)], loadComponent: () => import('./pages/home/home.component').then(m => m.HomePage) },
  { path: 'projects', canActivate: [setLang(lang)], loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsPage) },
  { path: 'services', canActivate: [setLang(lang)], loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesPage) },
  { path: 'experience', canActivate: [setLang(lang)], loadComponent: () => import('./pages/experience/experience.component').then(m => m.ExperiencePage) },
  { path: 'education', canActivate: [setLang(lang)], loadComponent: () => import('./pages/education/education.component').then(m => m.EducationPage) },
  { path: 'contact', canActivate: [setLang(lang)], loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactPage) },
  {
    path: 'projects/:slug',
    canActivate: [setLang(lang)],
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then((m) => m.ProjectDetailComponent),
  },
];

export const routes: Routes = [
  { path: 'es', children: pages('es') },
  ...pages('en'),
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundPage) },
];
