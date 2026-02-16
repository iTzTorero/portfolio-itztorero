import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

type LocalizedText = { en: string; es: string };
type LocalizedList = { en: string[]; es: string[] };

type EduItem = {
  school: LocalizedText;
  title: LocalizedText;
  type?: LocalizedText;      // e.g. "On-site" / "Presencial"
  location?: LocalizedText;  // e.g. "Mexico" / "México"
  start: string;             // YYYY-MM
  end?: string;              // YYYY-MM or ""
  summary: LocalizedText;
  highlights?: LocalizedList;
  focus?: string[];          // tags/pills (pueden ir en inglés o mixto)
};

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationPage {
  items = signal<EduItem[]>([]);
  expanded = signal<Record<number, boolean>>({});

  constructor(private http: HttpClient, private transloco: TranslocoService) {
    this.http.get<EduItem[]>('assets/education.json').subscribe({
      next: (data) => this.items.set(data ?? []),
      error: () => this.items.set([]),
    });
  }

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

  toggle(i: number) {
    this.expanded.set({ ...this.expanded(), [i]: !this.expanded()[i] });
  }

  isExpanded(i: number) {
    return !!this.expanded()[i];
  }

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
        : this.transloco.translate('education.present'); // Present / Actual

    return `${fmt(start)} — ${endLabel}`;
  }
}
