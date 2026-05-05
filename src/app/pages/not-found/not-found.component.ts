import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/seo.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundPage {
  constructor(seo: SeoService) {
    seo.update({
      title: '404 — Not Found',
      description: 'Page not found.',
      path: '/404',
    });
  }
}
