import { isDevMode } from '@angular/core';
import { translocoConfig } from '@ngneat/transloco';

export const translocoConfigData = translocoConfig({
    availableLangs: ['en', 'es'],
    defaultLang: 'en',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
});
