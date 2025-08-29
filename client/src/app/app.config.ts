// app.config.ts
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppHttpInterceptor } from './core/http.interceptor';
import { API_BASE_URL } from './core/tokens';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';

export const httpLoaderFactory = provideTranslateHttpLoader({
  prefix: './assets/i18n/',
  suffix: '.json'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
     importProvidersFrom(
  TranslateModule.forRoot({
    loader: httpLoaderFactory
  })
),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic', appearance: 'outline' } },
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    provideRouter(routes),
    provideAnimations(),
    { provide: API_BASE_URL, useValue: '/api' }
  ]
};
