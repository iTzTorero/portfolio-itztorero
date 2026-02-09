import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    private document = inject(DOCUMENT);

    readonly theme = signal<Theme>('light');

    init() {
        if (!isPlatformBrowser(this.platformId)) return;

        const saved = (localStorage.getItem('theme') as Theme | null) ?? 'light';
        this.apply(saved);
    }

    toggle() {
        const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
        this.apply(next);
    }

    private apply(theme: Theme) {
        this.theme.set(theme);

        if (!isPlatformBrowser(this.platformId)) return;

        localStorage.setItem('theme', theme);
        this.document.documentElement.setAttribute('data-theme', theme);
    }
}
