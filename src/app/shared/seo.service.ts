import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const BASE_URL = 'https://itztorero.dev';
const OG_IMAGE = `${BASE_URL}/assets/og-image.png`;
const AUTHOR = 'Juan Pablo Valenzuela Castro';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  update(opts: { title: string; description: string; path?: string; noindex?: boolean }) {
    const fullTitle = `${opts.title} | ${AUTHOR}`;
    const url = `${BASE_URL}${opts.path ?? ''}`;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: opts.description });
    this.meta.updateTag({ name: 'author', content: AUTHOR });
    this.meta.updateTag({
      name: 'robots',
      content: opts.noindex ? 'noindex, follow' : 'index, follow',
    });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: opts.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: opts.description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.setCanonical(url);
  }

  /** Updates the real <link rel="canonical"> in <head> (creating it if absent). */
  private setCanonical(url: string) {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
