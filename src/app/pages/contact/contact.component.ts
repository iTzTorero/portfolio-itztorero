import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { AnalyticsService } from '../../shared/analytics.service';

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactPage {
  // Web3Forms access key (public by design — it only routes messages to the
  // account owner). Empty string falls back to a mailto: link.
  private readonly WEB3FORMS_ACCESS_KEY = '63616613-8cb8-46e6-97d2-33bee751e2b4';

  private analytics = inject(AnalyticsService);

  status = signal<SubmitStatus>('idle');

  get whatsappLink(): string {
    const text = this.transloco.translate('contact.whatsappText');
    return `https://wa.me/526871748530?text=${encodeURIComponent(text)}`;
  }

  trackWhatsApp() {
    this.analytics.track('contact_click', { channel: 'whatsapp' });
  }

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(private fb: FormBuilder, private transloco: TranslocoService, seo: SeoService) {
    const es = this.transloco.getActiveLang() === 'es';
    seo.update({
      title: es ? 'Contacto — Vacantes y proyectos' : 'Contact — Roles & Projects',
      description: es
        ? '¿Una vacante de backend, cloud o IA, o un sistema para tu negocio? Escríbele a Juan Pablo Valenzuela desde esta página; responde en menos de 24 horas.'
        : 'Hiring for a backend, cloud or AI role — or need software built for your business? Message Juan Pablo Valenzuela directly from this page.',
      path: '/contact',
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.value.name ?? '';
    const email = this.form.value.email ?? '';
    const message = this.form.value.message ?? '';

    if (this.WEB3FORMS_ACCESS_KEY) {
      await this.sendViaWeb3Forms(name, email, message);
      return;
    }

    this.sendViaMailto(name, email, message);
  }

  private async sendViaWeb3Forms(name: string, email: string, message: string) {
    this.status.set('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: this.WEB3FORMS_ACCESS_KEY,
          subject: this.transloco.translate('contact.mail.subject').replace('{{name}}', name),
          from_name: name,
          name,
          email,
          message,
        }),
      });

      if (res.ok) {
        this.status.set('sent');
        this.analytics.track('contact_submit', { method: 'web3forms' });
        this.form.reset();
      } else {
        this.status.set('error');
      }
    } catch {
      this.status.set('error');
    }
  }

  private sendViaMailto(name: string, email: string, message: string) {
    const subjectTpl = this.transloco.translate('contact.mail.subject');
    const bodyTpl = this.transloco.translate('contact.mail.body');

    const subject = encodeURIComponent(subjectTpl.replace('{{name}}', name));
    const body = encodeURIComponent(
      bodyTpl
        .replace('{{name}}', name)
        .replace('{{email}}', email)
        .replace('{{message}}', message)
    );

    window.location.href = `mailto:valenzuelacastrojuanpablo@gmail.com?subject=${subject}&body=${body}`;

    this.analytics.track('contact_click', { channel: 'mailto' });
    this.status.set('mailto');
    this.form.reset();
  }
}
