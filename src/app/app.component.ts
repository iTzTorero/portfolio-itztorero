import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from './shared/theme.service';
import { LangService } from './shared/lang.service';
import { AnalyticsService } from './shared/analytics.service';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnim', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('260ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  theme = inject(ThemeService);
  lang = inject(LangService);

  private isBrowser: boolean;

  constructor(
    private transloco: TranslocoService,
    private router: Router,
    analytics: AnalyticsService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // El idioma real lo fija el guard de la ruta (/es/* → es); aquí solo
    // se decide la redirección inicial según preferencia guardada/navegador.
    if (this.isBrowser) {
      const path = location.pathname;
      const isEs = path === '/es' || path.startsWith('/es/');
      let saved: string | null = null;
      try {
        saved = localStorage.getItem('lang');
      } catch {}
      const prefersEs = saved ? saved === 'es' : navigator.language?.toLowerCase().startsWith('es');

      if (!isEs && prefersEs && saved !== 'en') {
        this.router.navigateByUrl(path === '/' ? '/es' : `/es${path}`);
      }
    }

    this.theme.init();
    analytics.init();
  }

  menuOpen = false;

  openMenu() {
    this.menuOpen = true;
    document.body.style.overflow = 'hidden'; // evita scroll detrás
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.menuOpen) this.closeMenu();
  }

  toggleLang() {
    this.lang.toggle();
  }
}
