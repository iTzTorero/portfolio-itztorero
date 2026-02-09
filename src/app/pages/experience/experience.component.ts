import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type ExpItem = {
  company: string;
  title: string;
  type?: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string;  // YYYY-MM or ""
  summary: string;
  highlights?: string[];
  tech?: string[];
};

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperiencePage {
  items = signal<ExpItem[]>([]);
  expanded = signal<Record<number, boolean>>({});

  constructor(private http: HttpClient) {
    this.http.get<ExpItem[]>('assets/experience.json').subscribe({
      next: (data) => this.items.set(data),
      error: () => this.items.set([]),
    });
  }

  toggle(i: number) {
    const map = { ...this.expanded() };
    map[i] = !map[i];
    this.expanded.set(map);
  }

  isExpanded(i: number) {
    return !!this.expanded()[i];
  }

  formatRange(start: string, end?: string) {
    const fmt = (s: string) => {
      const [y, m] = s.split('-').map(Number);
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] ?? '';
      return `${month} ${y}`;
    };
    const e = end && end.trim().length ? fmt(end) : 'Present';
    return `${fmt(start)} — ${e}`;
  }
}
