import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';

const BASE_URL = 'https://itztorero.dev';
const OG_IMAGE = `${BASE_URL}/assets/og-image.png`;
const AUTHOR = 'Juan Pablo Valenzuela Castro';
const MAX_DESCRIPTION = 158;

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    private transloco: TranslocoService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  /**
   * `path` siempre es la ruta EN (sin prefijo /es); el prefijo del idioma
   * activo se aplica aquí para canonical y hreflang.
   */
  update(opts: {
    title: string;
    description: string;
    path?: string;
    noindex?: boolean;
    /** Título completo sin el sufijo "| Autor" (para la home). */
    titleAbsolute?: boolean;
    /**
     * Canonical hacia otro dominio.
     *
     * Se usa cuando una página de aquí dice lo mismo que una de valc.tech: sin
     * esto las dos compiten por la misma búsqueda y Google elige una, que suele
     * ser la más antigua. Apuntar el canonical al sitio nuevo consolida la
     * señal allá en vez de repartirla.
     */
    canonicalExterno?: string;
  }) {
    const lang = this.transloco.getActiveLang() === 'es' ? 'es' : 'en';
    const fullTitle = opts.titleAbsolute ? opts.title : `${opts.title} | ${AUTHOR}`;
    const description = this.truncate(opts.description);
    const basePath = opts.path ?? '';
    const url = `${BASE_URL}${lang === 'es' ? this.esPath(basePath) : basePath || '/'}`;

    this.title.setTitle(fullTitle);
    this.doc.documentElement.lang = lang;

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: AUTHOR });
    this.meta.updateTag({
      name: 'robots',
      content: opts.noindex ? 'noindex, follow' : 'index, follow',
    });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: OG_IMAGE });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'es' ? 'es_MX' : 'en_US' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: OG_IMAGE });

    this.setCanonical(opts.canonicalExterno ?? url);

    // Con el canonical apuntando fuera, declarar aquí las versiones de idioma
    // mandaría señales contradictorias: la página canónica es la de allá y es
    // ella la que declara sus propios idiomas.
    if (!opts.canonicalExterno) {
      this.setHreflang(basePath, opts.noindex ?? false);
    }
  }

  /** Inserta (o reemplaza) un bloque JSON-LD identificado por `id`. */
  setJsonLd(id: string, data: object) {
    this.clearJsonLd(id);
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-jsonld', id);
    script.textContent = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  clearJsonLd(id: string) {
    this.doc.head
      .querySelectorAll(`script[data-jsonld="${id}"]`)
      .forEach((s) => s.remove());
  }

  private truncate(text: string): string {
    if (text.length <= MAX_DESCRIPTION) return text;
    const cut = text.slice(0, MAX_DESCRIPTION - 1);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
  }

  private esPath(basePath: string): string {
    return basePath === '' || basePath === '/' ? '/es' : `/es${basePath}`;
  }

  private setCanonical(url: string) {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setHreflang(basePath: string, noindex: boolean) {
    this.doc.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((l) => l.remove());
    if (noindex) return;

    const enUrl = `${BASE_URL}${basePath || '/'}`;
    const esUrl = `${BASE_URL}${this.esPath(basePath)}`;
    const pairs: Array<[string, string]> = [
      ['en', enUrl],
      ['es-MX', esUrl],
      ['x-default', enUrl],
    ];
    for (const [hreflang, href] of pairs) {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    }
  }
}
