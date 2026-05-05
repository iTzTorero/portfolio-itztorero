import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const BASE_URL = 'https://itztorero.dev';
const OG_IMAGE = `${BASE_URL}/assets/og-image.png`;
const AUTHOR = 'Juan Pablo Valenzuela Castro';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  update(opts: { title: string; description: string; path?: string }) {
    const fullTitle = `${opts.title} | ${AUTHOR}`;
    const url = `${BASE_URL}${opts.path ?? ''}`;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: opts.description });
    this.meta.updateTag({ name: 'author', content: AUTHOR });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: opts.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: opts.description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.meta.updateTag({ rel: 'canonical', href: url }, 'rel=canonical');
  }
}
