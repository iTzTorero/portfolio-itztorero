import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { LangService } from '../../shared/lang.service';
import { LocalizedText, LocalizedList, Project, ProjectCategory } from '../../shared/portfolio.types';

// Categorías curadas de primer nivel; los tags finos siguen cubiertos por el buscador.
const CATEGORIES: { key: ProjectCategory; label: string }[] = [
  { key: 'saas', label: 'projects.filters.saas' },
  { key: 'ai', label: 'projects.filters.ai' },
  { key: 'data', label: 'projects.filters.data' },
  { key: 'mobile', label: 'projects.filters.mobile' },
  { key: 'custom', label: 'projects.filters.custom' },
];

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsPage {
  // state
  projects = signal<Project[]>([]);
  query = signal('');
  activeCategory = signal<ProjectCategory | null>(null);

  categories = CATEGORIES;
  langSvc = inject(LangService);

  constructor(private http: HttpClient, private transloco: TranslocoService, seo: SeoService) {
    const es = this.langSvc.lang === 'es';
    seo.update({
      title: es
        ? 'Proyectos — SaaS y sistemas cloud en producción'
        : 'Projects — SaaS & Cloud Systems in Production',
      description: es
        ? 'Productos SaaS en producción, sistemas para clientes y ML aplicado, construidos y operados por Juan Pablo Valenzuela sobre GCP y Firebase.'
        : 'SaaS products in production, client systems, and applied ML — built and operated end-to-end by Juan Pablo Valenzuela on GCP and Firebase.',
      path: '/projects',
    });
    this.http.get<Project[]>('assets/projects.json').subscribe({
      next: (data) => this.projects.set(data ?? []),
      error: () => this.projects.set([]),
    });
  }

  // language helpers
  lang(): 'en' | 'es' {
    const l = this.transloco.getActiveLang();
    return (l === 'es' ? 'es' : 'en');
  }

  t(obj?: LocalizedText | null): string {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? '';
  }

  tArr(obj?: LocalizedList | null): string[] {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? [];
  }

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.activeCategory();
    const lang = this.lang(); // para que el computed reaccione al cambio de idioma

    return this.projects().filter((p) => {
      const matchesCat = !cat || (p.categories ?? []).includes(cat);

      const productsText = (p.products ?? [])
        .map((x) => `${x.name} ${x.type?.[lang] ?? x.type?.en ?? ''} ${x.description?.[lang] ?? x.description?.en ?? ''}`)
        .join(' ');

      const hay = [
        this.t(p.name),
        this.t(p.summary),
        p.stack.join(' '),
        (p.tags ?? []).join(' '),
        productsText,
      ]
        .join(' ')
        .toLowerCase();

      const matchesQ = !q || hay.includes(q);

      return matchesCat && matchesQ;
    });
  });

  setCategory(cat: ProjectCategory | null) {
    this.activeCategory.set(cat);
  }

  clear() {
    this.query.set('');
    this.activeCategory.set(null);
  }
}
