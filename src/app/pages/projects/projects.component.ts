import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Project = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];

  tags?: string[];

  ownership?: 'personal' | 'professional';
  role?: string;

  products?: { name: string; type: string; description: string }[];

  github?: string;
  demo?: string;
};


@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsPage {
  // state
  projects = signal<Project[]>([]);
  query = signal('');
  activeTag = signal<string | null>(null);

  // derived
  tags = computed(() => {
    const set = new Set<string>();
    for (const p of this.projects()) {
      for (const t of (p.tags ?? [])) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });


  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const tag = this.activeTag();

    return this.projects().filter((p) => {
      const tags = p.tags ?? [];
      const matchesTag = !tag || tags.includes(tag);

      const productsText = (p.products ?? [])
        .map((x) => `${x.name} ${x.type} ${x.description}`)
        .join(' ');

      const hay = `${p.name} ${p.summary} ${p.stack.join(' ')} ${tags.join(' ')} ${productsText}`.toLowerCase();
      const matchesQ = !q || hay.includes(q);

      return matchesTag && matchesQ;
    });
  });


  constructor(private http: HttpClient) {
    this.http
      .get<Project[]>('assets/projects.json')
      .subscribe({
        next: (data) => this.projects.set(data),
        error: () => this.projects.set([]),
      });
  }

  setTag(tag: string | null) {
    this.activeTag.set(tag);
  }

  clear() {
    this.query.set('');
    this.activeTag.set(null);
  }
}
