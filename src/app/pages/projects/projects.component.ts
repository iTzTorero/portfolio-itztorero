import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { LocalizedText, LocalizedList, Project } from '../../shared/portfolio.types';

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
  activeTag = signal<string | null>(null);

  constructor(private http: HttpClient, private transloco: TranslocoService, seo: SeoService) {
    seo.update({
      title: 'Projects',
      description: 'Projects by Juan Pablo Valenzuela — cloud-native data platforms, ETL pipelines, ML-driven applications, and production SaaS built on GCP.',
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

  // derived
  tags = computed(() => {
    const set = new Set<string>();
    for (const p of this.projects()) {
      for (const t of p.tags ?? []) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const tag = this.activeTag();
    const lang = this.lang(); // para que el computed reaccione al cambio de idioma

    return this.projects().filter((p) => {
      const tags = p.tags ?? [];
      const matchesTag = !tag || tags.includes(tag);

      const productsText = (p.products ?? [])
        .map((x) => `${x.name} ${x.type?.[lang] ?? x.type?.en ?? ''} ${x.description?.[lang] ?? x.description?.en ?? ''}`)
        .join(' ');

      const hay = [
        this.t(p.name),
        this.t(p.summary),
        p.stack.join(' '),
        tags.join(' '),
        productsText,
      ]
        .join(' ')
        .toLowerCase();

      const matchesQ = !q || hay.includes(q);

      return matchesTag && matchesQ;
    });
  });

  setTag(tag: string | null) {
    this.activeTag.set(tag);
  }

  clear() {
    this.query.set('');
    this.activeTag.set(null);
  }
}
