import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTransloco } from '@ngneat/transloco';
import { translocoConfigData } from '../transloco.loader';
import { TranslocoHttpLoader } from './transloco.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideTransloco({
      config: translocoConfigData,
      loader: TranslocoHttpLoader,
    }),
  ],
};
