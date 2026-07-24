import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactPage {
  // Paste a free Web3Forms access key (https://web3forms.com) to receive messages
  // directly — no email client needed. Leave empty to fall back to a mailto: link.
  private readonly WEB3FORMS_ACCESS_KEY = '';

  status = signal<SubmitStatus>('idle');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(private fb: FormBuilder, private transloco: TranslocoService, seo: SeoService) {
    seo.update({
      title: 'Contact',
      description: 'Get in touch with Juan Pablo Valenzuela — available for remote backend, cloud, and AI systems roles. Send a message directly from this page.',
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

    this.status.set('mailto');
    this.form.reset();
  }
}
