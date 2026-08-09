import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { SeoService } from '../../shared/seo.service';
import { LangService } from '../../shared/lang.service';

@Component({
  standalone: true,
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundPage {
  lang = inject(LangService);

  constructor(seo: SeoService) {
    seo.update({
      title: '404 — Not Found',
      description: 'Page not found.',
      path: '/404',
      noindex: true,
    });
  }
}
