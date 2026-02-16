import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from './shared/theme.service';
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

  activeLang: 'en' | 'es' = 'en';
  private isBrowser: boolean;

  constructor(
    private transloco: TranslocoService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // ✅ Siempre define un idioma (server + browser)
    this.transloco.setActiveLang(this.activeLang);

    // ✅ Solo en browser: leer navigator/localStorage y setear html lang
    if (this.isBrowser) {
      const saved = localStorage.getItem('lang') as 'en' | 'es' | null;
      const browser = navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';

      this.activeLang = saved ?? browser;
      this.transloco.setActiveLang(this.activeLang);
      document.documentElement.lang = this.activeLang;
    }

    // Theme init (si ThemeService usa localStorage, conviene que también sea SSR-safe)
    this.theme.init();
  }
  menuOpen = false;

  openMenu() {
    this.menuOpen = true;
    document.body.style.overflow = "hidden"; // evita scroll detrás
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = "";
  }

  // opcional: cerrar con ESC
  @HostListener("document:keydown.escape")
  onEsc() {
    if (this.menuOpen) this.closeMenu();
  }

  setLang(lang: 'en' | 'es') {
    this.activeLang = lang;
    this.transloco.setActiveLang(lang);

    if (this.isBrowser) {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    }
  }
  toggleLang() {
    const next = this.activeLang === 'en' ? 'es' : 'en';
    this.setLang(next);
  }

}
