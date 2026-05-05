import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

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

  skillGroups = [
    { label: 'home.skills.backend', items: ['Node.js', 'Python', 'FastAPI'] },
    { label: 'home.skills.cloud', items: ['GCP', 'Docker', 'Microservices'] },
    { label: 'home.skills.ml', items: ['ML Pipelines', 'Geospatial Data', 'Computer Vision'] },
    { label: 'home.skills.frontend', items: ['Angular', 'Vue 3', 'TypeScript'] },
  ];

  private lang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  cvUrl = computed(() =>
    this.lang() === 'es'
      ? 'assets/CV_JuanPablo_Valenzuela_ES.pdf'
      : 'assets/CV_JuanPablo_Valenzuela_EN.pdf'
  );

  cvFilename = computed(() =>
    this.lang() === 'es'
      ? 'CV_JuanPablo_Valenzuela_ES.pdf'
      : 'CV_JuanPablo_Valenzuela_EN.pdf'
  );

  constructor(private transloco: TranslocoService) {}
}
