import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactPage {
  sent = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(private fb: FormBuilder, private transloco: TranslocoService) { }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.value.name ?? '';
    const email = this.form.value.email ?? '';
    const message = this.form.value.message ?? '';

    const subjectTpl = this.transloco.translate('contact.mail.subject'); // ej: "Portfolio contact — {{name}}"
    const bodyTpl = this.transloco.translate('contact.mail.body');       // ej: "Name: {{name}}\nEmail: {{email}}\n\n{{message}}"

    const subject = encodeURIComponent(subjectTpl.replace('{{name}}', name));
    const body = encodeURIComponent(
      bodyTpl
        .replace('{{name}}', name)
        .replace('{{email}}', email)
        .replace('{{message}}', message)
    );

    window.location.href = `mailto:valenzuelacastrojuanpablo@gmail.com?subject=${subject}&body=${body}`;

    this.sent.set(true);
    this.form.reset();
  }
}