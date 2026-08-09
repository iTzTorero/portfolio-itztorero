import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * TODO(Juan Pablo): pegar aquí el Measurement ID de GA4 (G-XXXXXXXXXX) para
 * activar la medición. Con la cadena vacía todo es un no-op: no se carga
 * ningún script ni se envía nada.
 */
const GA_MEASUREMENT_ID = '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private loaded = false;

  init() {
    if (!this.isBrowser || !GA_MEASUREMENT_ID || this.loaded) return;
    this.loaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  /** Eventos del plan: cv_download {lang}, contact_click {channel}, contact_submit. */
  track(event: string, params: Record<string, string> = {}) {
    if (!this.isBrowser || !GA_MEASUREMENT_ID || !window.gtag) return;
    window.gtag('event', event, params);
  }
}
