import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';

type LocalizedText = { en: string; es: string };
type LocalizedList = { en: string[]; es: string[] };

type ExpItem = {
  company: LocalizedText;
  title: LocalizedText;
  type?: LocalizedText;
  location?: LocalizedText;

  start: string; // YYYY-MM
  end?: string;  // YYYY-MM or "" or undefined

  summary: LocalizedText;
  highlights?: LocalizedList;
  tech?: string[];
};

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperiencePage {
  items = signal<ExpItem[]>([]);
  expanded = signal<Record<number, boolean>>({});

  constructor(private http: HttpClient, private transloco: TranslocoService, seo: SeoService) {
    seo.update({
      title: 'Experience',
      description: 'Work experience of Juan Pablo Valenzuela — backend and cloud engineering on GCP at Monteli LLC, and ML research at IPN in precision agriculture.',
      path: '/experience',
    });
    this.http.get<ExpItem[]>('assets/experience.json').subscribe({
      next: (data) => this.items.set(data ?? []),
      error: () => this.items.set([]),
    });
  }

  // --- i18n helpers ---
  lang(): 'en' | 'es' {
    const l = this.transloco.getActiveLang();
    return l === 'es' ? 'es' : 'en';
  }

  t(obj?: LocalizedText | null): string {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? '';
  }

  tArr(obj?: LocalizedList | null): string[] {
    const l = this.lang();
    return obj?.[l] ?? obj?.en ?? [];
  }

  // --- UI state ---
  toggle(i: number) {
    this.expanded.set({ ...this.expanded(), [i]: !this.expanded()[i] });
  }

  isExpanded(i: number) {
    return !!this.expanded()[i];
  }

  // --- Dates ---
  private monthName(m: number) {
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return (this.lang() === 'es' ? monthsEs : monthsEn)[m - 1] ?? '';
  }

  formatRange(start: string, end?: string) {
    const fmt = (s: string) => {
      const [y, m] = s.split('-').map(Number);
      return `${this.monthName(m)} ${y}`;
    };

    const endLabel =
      end && end.trim().length
        ? fmt(end)
        : this.transloco.translate('experience.present'); // "Present" / "Actual"

    return `${fmt(start)} — ${endLabel}`;
  }
}
