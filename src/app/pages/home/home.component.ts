import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeoService } from '../../shared/seo.service';
import { LangService } from '../../shared/lang.service';
import { AnalyticsService } from '../../shared/analytics.service';

@Component({
  standalone: true,
  imports: [RouterLink, CommonModule, TranslocoPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomePage {
  name = 'Juan Pablo Valenzuela Castro';
  location = 'Mexico (Remote)';
  email = 'valenzuelacastrojuanpablo@gmail.com';

  lang = inject(LangService);
  analytics = inject(AnalyticsService);

  skillGroups = [
    { label: 'home.skills.backendCloud', items: ['Node.js', 'Python (FastAPI)', 'GCP', 'Firebase', 'Cloud Functions', 'Docker'] },
    { label: 'home.skills.ai', items: ['GPT agents (function calling)', 'ML Pipelines', 'Computer Vision', 'Geospatial Data'] },
    { label: 'home.skills.product', items: ['Stripe (subscriptions, webhooks)', 'CFDI 4.0 e-invoicing', 'WhatsApp Cloud API', 'Multi-tenant SaaS'] },
    { label: 'home.skills.frontend', items: ['Angular (signals, PWA)', 'Vue 3', 'TypeScript', 'Tailwind'] },
  ];

  private langSignal = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  cvUrl = computed(() =>
    this.langSignal() === 'es'
      ? 'assets/CV_JuanPablo_Valenzuela_ES.pdf'
      : 'assets/CV_JuanPablo_Valenzuela_EN.pdf'
  );

  cvFilename = computed(() =>
    this.langSignal() === 'es'
      ? 'CV_JuanPablo_Valenzuela_ES.pdf'
      : 'CV_JuanPablo_Valenzuela_EN.pdf'
  );

  constructor(private transloco: TranslocoService, seo: SeoService) {
    const es = this.lang.lang === 'es';
    seo.update({
      title: es
        ? 'Juan Pablo Valenzuela — Ingeniero Backend, Cloud e IA · Node.js, Python, GCP'
        : 'Juan Pablo Valenzuela — Backend, Cloud & AI Engineer · Node.js, Python, GCP',
      titleAbsolute: true,
      description: es
        ? 'Ingeniero de software en GCP y Firebase. Construyo y opero SaaS en producción: agentes LLM, Stripe y CFDI 4.0. Abierto a roles remotos y proyectos.'
        : 'Software engineer on GCP & Firebase. I build and operate production SaaS end-to-end: LLM agents, Stripe billing, CFDI 4.0. Open to remote backend & AI roles.',
      path: '/',
    });
  }

  trackCvDownload() {
    this.analytics.track('cv_download', { lang: this.lang.lang });
  }

  trackContactClick(channel: string) {
    this.analytics.track('contact_click', { channel });
  }
}
