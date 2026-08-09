import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

/**
 * La URL es la fuente de verdad del idioma: /es/* → español, resto → inglés.
 * Este servicio centraliza el prefijo para routerLinks y el toggle navegable.
 */
@Injectable({ providedIn: 'root' })
export class LangService {
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get lang(): 'en' | 'es' {
    return this.transloco.getActiveLang() === 'es' ? 'es' : 'en';
  }

  /** Construye un link interno respetando el idioma activo. */
  link(path: string): string {
    if (this.lang !== 'es') return path;
    return path === '/' ? '/es' : `/es${path}`;
  }

  /** Cambia de idioma navegando a la ruta equivalente del otro idioma. */
  toggle() {
    const url = this.router.url.split('?')[0].split('#')[0];
    const isEs = url === '/es' || url.startsWith('/es/');
    const bare = isEs ? url.slice(3) || '/' : url;
    const next = isEs ? bare : bare === '/' ? '/es' : `/es${bare}`;

    if (this.isBrowser) {
      try {
        localStorage.setItem('lang', isEs ? 'en' : 'es');
      } catch {}
    }
    this.router.navigateByUrl(next);
  }
}
