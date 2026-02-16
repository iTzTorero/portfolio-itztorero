import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

type LocalizedText = { en: string; es: string };
type LocalizedList = { en: string[]; es: string[] };

type Project = {
  slug: string;

  name: LocalizedText;
  summary: LocalizedText;

  stack: string[];
  tags?: string[];

  ownership?: 'personal' | 'professional';
  role?: LocalizedText;

  confidentiality?: LocalizedText;
  disclaimer?: LocalizedText;

  products?: {
    name: string;
    type: LocalizedText;
    description: LocalizedText;
  }[];

  impact?: LocalizedList;
  highlights?: LocalizedList;
  architecture?: LocalizedList;

  github?: string;
  demo?: string;
};

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

  constructor(private http: HttpClient, private transloco: TranslocoService) {
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

  // actions
  setTag(tag: string | null) {
    this.activeTag.set(tag);
  }

  clear() {
    this.query.set('');
    this.activeTag.set(null);
  }
}
