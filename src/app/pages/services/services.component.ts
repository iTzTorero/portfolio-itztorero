import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { LangService } from '../../shared/lang.service';
import { AnalyticsService } from '../../shared/analytics.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesPage {
  lang = inject(LangService);
  private transloco = inject(TranslocoService);
  private analytics = inject(AnalyticsService);

  // Cada vertical usa un producto real en producción como prueba.
  verticals = [
    { key: 'agendabot', slug: 'agendabot-pro' },
    { key: 'sociko', slug: 'sociko' },
    { key: 'numa', slug: 'numa' },
    { key: 'jbp', slug: 'jbp-software' },
  ];

  steps = ['step1', 'step2', 'step3'];

  get whatsappLink(): string {
    const text = this.transloco.translate('services.whatsappText');
    return `https://wa.me/526871748530?text=${encodeURIComponent(text)}`;
  }

  trackWhatsApp() {
    this.analytics.track('contact_click', { channel: 'whatsapp' });
  }

  constructor(seo: SeoService) {
    const es = this.lang.lang === 'es';
    seo.update({
      title: es
        ? 'Software a medida y SaaS para negocios en México | VALC Tech — Juan Pablo Valenzuela'
        : 'Custom Software & SaaS for Businesses in Mexico | VALC Tech — Juan Pablo Valenzuela',
      titleAbsolute: true,
      description: es
        ? 'Desarrollo software a medida y SaaS en México: citas por WhatsApp, sistemas para gimnasios, POS con CFDI 4.0 y plataformas cloud sobre GCP. En producción con clientes reales.'
        : 'I build custom software and SaaS on GCP: WhatsApp appointment booking, gym management, POS with Mexican e-invoicing (CFDI 4.0). Live in production with real clients.',
      path: '/services',
      // Este contenido vive de verdad en valc.tech; aquí es un puente.
      canonicalExterno: 'https://valc.tech',
    });
  }
}
